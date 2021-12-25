from flask_restx import Api, Resource, Namespace, fields
from models import User
from models import Account
from werkzeug.security import generate_password_hash, check_password_hash
from flask_jwt_extended import (
    JWTManager,
    create_access_token,
    create_refresh_token,
    jwt_required,
    get_jwt_identity
    )
import uuid
from flask import Flask, request, jsonify, make_response


auth_ns = Namespace('auth', description='A namespace for Authhentication')


# Serializers

signup_model = auth_ns.model(
    'SignUp', 
    {
        "username":fields.String(),
        "email":fields.String(),
        "password":fields.String(),
        "firstname":fields.String(),
        "lastname":fields.String(),
        "address":fields.String(),
        "city":fields.String(),
        "country":fields.String(),
        "phone":fields.String()
    }
)

login_model = auth_ns.model(
    'Login', {
        'email':fields.String(),
        'password':fields.String(),
    }
)

activate_model = auth_ns.model(
    'Activate', {
        'card_number': fields.String(),
        'name': fields.String(),
        'expired_date': fields.String(),
        'secure_code': fields.String()
    }
)

user_edit_model = auth_ns.model(
    'User', 
    {
        "password":fields.String(),
        "firstname":fields.String(),
        "lastname":fields.String(),
        "address":fields.String(),
        "city":fields.String(),
        "country":fields.String(),
        "phone":fields.String()
    }
)

user_model = auth_ns.model(
    'User', 
    {
        "username":fields.String(),
        "email":fields.String(),
        "firstname":fields.String(),
        "lastname":fields.String(),
        "address":fields.String(),
        "city":fields.String(),
        "country":fields.String(),
        "phone":fields.String(),
        "isActive":fields.String()
    }
)

@auth_ns.route('/signup')
class SigunUp(Resource):
    @auth_ns.expect(signup_model)
    def post(self):
        data = request.get_json()
        
        username = data.get('username')
        email = data.get('email')

        db_user = User.query.filter_by(username=username).first()
        db_email = User.query.filter_by(email=email).first()

        if db_user is not None:
            return jsonify({"message": f"User with username {username} already exists"})

        if db_email is not None:
            return jsonify({"message": f"User with email {email} already exists"})

        new_user = User(
            username = data.get('username'),
            email = data.get('email'),
            password = generate_password_hash(data.get('password')),
            firstname=data.get('firstname'),
            lastname=data.get('lastname'),
            address=data.get('address'),
            city=data.get('city'),
            country=data.get('country'),
            phone=data.get('phone'),
            isActive=False
        )
        new_user.save()
        user = User.query.filter_by(email=new_user.email).first()
        account = Account(
            id = str(uuid.uuid4()),
            user_id = user.id,
            balance=0,
            currency="RSD",
        )
        
        account.save()
        
        return jsonify({"message": f"User created successfully"})


@auth_ns.route('/login')
class Login(Resource):
    @auth_ns.expect(login_model)
    def post(self):
        data = request.get_json()

        email = data.get('email')
        password = data.get('password')

        db_user = User.query.filter_by(email=email).first()
        
        if db_user and check_password_hash(db_user.password, password):
            access_token = create_access_token(identity=db_user.email)
            refresh_token = create_refresh_token(identity=db_user.email)
        else:
            return make_response(jsonify({"message": "Invalid email or password"}), 401)

        return jsonify({"access_token": access_token, "refresh_token":refresh_token, "userData": {
            "username":db_user.username,
            "email":db_user.email,
            "firstname":db_user.firstname,
            "lastname":db_user.lastname,
            "address":db_user.address,
            "city":db_user.city,
            "country":db_user.country,
            "phone":db_user.phone,
            "isActive":db_user.isActive
        }})


@auth_ns.route('/refresh')
class RefreshResource(Resource):
    @jwt_required(refresh=True)    
    def post(self):
        
        current_user = get_jwt_identity()
        
        new_access_token = create_access_token(identity=current_user)

        return make_response(jsonify({"access_token": new_access_token}), 200)

@auth_ns.route('/activate')
class ActivateUser(Resource):
    @jwt_required()    
    @auth_ns.expect(activate_model)
    def post(self):
        card = request.get_json()
        #check bank card

        current_user = get_jwt_identity()
        user = User.query.filter_by(email = current_user).first()

        if(user.isActive == True):
            return jsonify({'message' : 'User already activated.'})  

        user.activate()

        return jsonify({'message' : 'User successfully activated.'}) 

@auth_ns.route('/userinfo')
class UserResource(Resource):
    @jwt_required()
    @auth_ns.marshal_with(user_model)
    def get(self):
        current_user = get_jwt_identity()

        user = User.query.filter_by(email = current_user).first()

        return user
    
    @jwt_required()
    @auth_ns.expect(user_edit_model)
    def put(self):
        data = request.get_json()

        current_user = get_jwt_identity()

        user = User.query.filter_by(email = current_user).first()
        
        user.update(
            generate_password_hash(data.get('password')),
            data.get('lastname'),
            data.get('firstname'),
            data.get('address'),
            data.get('city'),
            data.get('country'),
            data.get('phone'),
            )
        
        return jsonify({"message": f"User updated successfully"})

@auth_ns.route('/account-balance')
class AccountBalance(Resource):
    @jwt_required()
    def get(self):
        current_user = get_jwt_identity()

        user = User.query.filter_by(email = current_user).first()

        accounts = Account.query.filter_by(user_id = user.id)

        output = []

        for account in accounts:
            account_data = {}
            account_data['id'] = account.id
            account_data['balance'] = account.balance
            account_data['currency'] = account.currency
            account_data['user_id'] = account.user_id
            output.append(account_data)

        return jsonify({"accounts":output})


        
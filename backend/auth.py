from flask_restx import Api, Resource, Namespace, fields
from models import User
from werkzeug.security import generate_password_hash, check_password_hash
from flask_jwt_extended import (
    JWTManager,
    create_access_token,
    create_refresh_token,
    jwt_required,
    get_jwt_identity
    )
from flask import Flask, request, jsonify, make_response


auth_ns = Namespace('auth', description='A namespace for Authhentication')


# Serializers

signup_model = auth_ns.model(
    'SignUp', 
    {
        "username":fields.String(),
        "email":fields.String(),
        "password":fields.String(),
    }
)

login_model = auth_ns.model(
    'Login', {
        'email':fields.String(),
        'password':fields.String(),
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
            password = generate_password_hash(data.get('password'))
        )
        
        new_user.save()
        
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

        return jsonify({"access_token": access_token, "refresh_token":refresh_token})


@auth_ns.route('/refresh')
class RefreshResource(Resource):
    @jwt_required(refresh=True)    
    def post(self):
        
        current_user = get_jwt_identity()
        
        new_access_token = create_access_token(identity=current_user)

        return make_response(jsonify({"access_token": new_access_token}), 200)
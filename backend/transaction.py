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
from decimal import Decimal
from models import Account


trans_ns = Namespace('trans', description='A namespace for Transactions')

pay_money_model = trans_ns.model(
    'Activate', {
        'card_number': fields.String(),
        'name': fields.String(),
        'expired_date': fields.String(),
        'secure_code': fields.String(),
        'amount': fields.String()
    }
)

@trans_ns.route('/pay-money')
class PayMoney(Resource):
    @jwt_required()
    @trans_ns.expect(pay_money_model)
    def post(self):
        data = request.get_json()

        current_user = get_jwt_identity()
        user = User.query.filter_by(email = current_user).first()

        if(user.isActive == False):
            return jsonify({"message": f"You must activate user!"})

        account = Account.query.filter_by(user_id=user.id, currency='RSD').first()

        amount = Decimal(data['amount'])

        account.AddToBalance(amount)

        return jsonify({"message": f"Money successfully transferet to your account!"})

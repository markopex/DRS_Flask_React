from flask_restx import Api, Resource, Namespace, fields
import requests
from models import User
from models import OnlineTransaction
from models import BankTransaction
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
import uuid

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

        account.UpdateBalance(amount)

        return jsonify({"message": f"Money successfully transferet to your account!"})



transfer_to_user_model = trans_ns.model(
    'Transfer', {
        'amount': fields.String(),
        'accountId': fields.String(),
        'receiverEmail':fields.String()
    }
)

@trans_ns.route('/transfer-to-user')
class TransferToUser(Resource):
    @jwt_required()
    @trans_ns.expect(transfer_to_user_model)
    def post(self):
        data = request.get_json()
        current_user = get_jwt_identity()   
        userFrom = User.query.filter_by(email = current_user).first()

        if(userFrom.isActive == False):
            return jsonify({"message": f"You must activate user!"})

        userTo = User.query.filter_by(email = data['receiverEmail']).first()

        if userTo is None:
            return jsonify({"message": f"Unable to transfer money. User don't exists."})

        accountFrom = Account.query.filter_by(user_id=userFrom.id, id=data['accountId']).first()

        if accountFrom is None:
            return jsonify({"message": f"Unable to transfer money. Unable to find account with given account id"})

        accountTo = Account.query.filter_by(user_id=userTo.id, currency=accountFrom.currency).first()

        if accountTo is None:
            accountTo = Account(
                            id = str(uuid.uuid4()),
                            user_id = userTo.id,
                            balance=0,
                            currency=accountFrom.currency,
                            )
            accountTo.save()
        
        amount = Decimal(data['amount'])

        

        if((accountFrom.balance - amount) < 0):
            return jsonify({"message": f"Unable to transfer money. Lack of money."})

        accountFrom.UpdateBalance(-amount)
        accountTo.UpdateBalance(amount)

        transaction = OnlineTransaction(
            from_user = userFrom.id,
            to_user = userTo.id,
            amount = amount,
            currency = accountFrom.currency
        )

        transaction.save()

        return jsonify({"message": f"Money successfully transfered!"})

transfer_to_bank_acc_model = trans_ns.model(
    'Transfer', {
        'amount': fields.String(),
        'accountId': fields.String(),
        'recBankAccount':fields.String()
    }
)

@trans_ns.route('/transfer-to-bank-acc')
class TransferToBankAccount(Resource):
    @jwt_required()
    @trans_ns.expect(transfer_to_bank_acc_model)
    def post(self):
        data = request.get_json()
        current_user = get_jwt_identity()   
        userFrom = User.query.filter_by(email = current_user).first()

        if(userFrom.isActive == False):
            return jsonify({"message": f"You must activate user!"})

        accountFrom = Account.query.filter_by(user_id=userFrom.id, id=data['accountId']).first()

        if accountFrom is None:
            return jsonify({"message": f"Unable to transfer money. Unable to find account with given account id"})
        
        amount = Decimal(data['amount'])

        if((accountFrom.balance - amount) < 0):
            return jsonify({"message": f"Unable to transfer money. Lack of money."})

        accountFrom.UpdateBalance(-amount)

        transaction = BankTransaction(
            from_user = userFrom.id,
            to_bank_account = data['recBankAccount'],
            amount = amount,
            currency = accountFrom.currency
        )

        transaction.save()

        return jsonify({"message": f"Money successfully transfered!"})

@trans_ns.route('/exchange-list')
class ExchangeList(Resource):
    def get(self):
        response = requests.get('https://v6.exchangerate-api.com/v6/79e1b074acc0b9387cc202b9/latest/RSD?fbclid=IwAR06IHhToblkEk-ncAb4nWw-CiVedfBZceU1qs08V_s2T2yFK9sts3z_wRM').json()
        rates = response['conversion_rates']
        return rates

exchange_model = trans_ns.model(
    'Transfer', {
        'amount': fields.String(),
        'accountId': fields.String(),
        'newCurrency':fields.String()
    }
)
@trans_ns.route('/exchange')
class Exchange(Resource):
    @jwt_required()
    @trans_ns.expect(exchange_model)
    def post(self):
        data =  request.get_json()
        response = requests.get('https://v6.exchangerate-api.com/v6/79e1b074acc0b9387cc202b9/latest/RSD?fbclid=IwAR06IHhToblkEk-ncAb4nWw-CiVedfBZceU1qs08V_s2T2yFK9sts3z_wRM').json()
        rates = response['conversion_rates']

        new_currency = data['newCurrency']
        new_currency_rate = rates[new_currency]
        if new_currency_rate is None:
            return jsonify({"message": f"Unable to find currency."})

        new_currency_rate = Decimal(new_currency_rate)

        current_user = get_jwt_identity()   
        userFrom = User.query.filter_by(email = current_user).first()

        if(userFrom.isActive == False):
            return jsonify({"message": f"You must activate user!"})

        accountFrom = Account.query.filter_by(user_id=userFrom.id, id=data['accountId']).first()

        if accountFrom is None:
            return jsonify({"message": f"Unable to transfer money. Unable to find account with given account id"})
        
        amount = Decimal(data['amount'])

        if((accountFrom.balance - amount) < 0):
            return jsonify({"message": f"Unable to transfer money. Lack of money."})

        accountTo = Account.query.filter_by(user_id=userFrom.id, currency=new_currency).first()

        if accountTo is None:
            accountTo = Account(
                            id = str(uuid.uuid4()),
                            user_id = userFrom.id,
                            balance=0,
                            currency=new_currency,
                            )
        
        old_currency_amount = amount / Decimal(rates[accountFrom.currency])
        accountFrom.UpdateBalance(-old_currency_amount)
        new_currenct_amount = old_currency_amount * new_currency_rate
        accountTo.UpdateBalance(new_currenct_amount)

        accountTo.save()

        return jsonify({"message": f"Money successfully exchanged!"})
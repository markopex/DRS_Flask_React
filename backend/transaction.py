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



trans_ns = Namespace('trans', description='A namespace for Transactions')
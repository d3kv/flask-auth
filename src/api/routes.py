"""
This module takes care of starting the API Server, Loading the DB and Adding the endpoints
"""
from flask import Flask, request, jsonify, url_for, Blueprint
from api.models import db, User
from api.utils import generate_sitemap, APIException
from flask_cors import CORS
from werkzeug.security import generate_password_hash, check_password_hash
from flask_jwt_extended import create_access_token, jwt_required, get_jwt_identity

api = Blueprint('api', __name__)

# Allow CORS requests to this API
CORS(api)


@api.route('/hello', methods=['POST', 'GET'])
def handle_hello():

    response_body = {
        "message": "Hello! I'm a message that came from the backend, check the network tab on the google inspector and you will see the GET request"
    }

    return jsonify(response_body), 200


@api.route('/signup', methods=['POST'])
def signup():
    body = request.get_json(silent=True)
    if body is None or not body.get("email") or not body.get("password"):
        raise APIException("Email and password are required", status_code=400)

    if User.query.filter_by(email=body["email"]).first() is not None:
        raise APIException(
            "A user with this email already exists", status_code=409)

    user = User(
        email=body["email"],
        password=generate_password_hash(body["password"]),
        is_active=True
    )
    db.session.add(user)
    db.session.commit()

    return jsonify(user.serialize()), 201


@api.route('/token', methods=['POST'])
def create_token():
    body = request.get_json(silent=True)
    if body is None or not body.get("email") or not body.get("password"):
        raise APIException("Email and password are required", status_code=400)

    user = User.query.filter_by(email=body["email"]).first()
    if user is None or not check_password_hash(user.password, body["password"]):
        raise APIException("Invalid email or password", status_code=401)

    token = create_access_token(identity=str(user.id))
    return jsonify({"token": token, "user": user.serialize()}), 200


@api.route('/private', methods=['GET'])
@jwt_required()
def private():
    user = User.query.get(int(get_jwt_identity()))
    if user is None:
        raise APIException("User not found", status_code=404)

    return jsonify({
        "message": "You have access to the private area",
        "user": user.serialize()
    }), 200

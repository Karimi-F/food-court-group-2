import os
from flask import Flask, jsonify, request, redirect, url_for, flash
from flask_migrate import Migrate
from flask_restful import Api
from flask_cors import CORS
from models import db, User, Owner  # Import User and Owner models
from flask_jwt_extended import JWTManager, create_access_token

app = Flask(__name__)
app.config["SQLALCHEMY_DATABASE_URI"] = "postgresql://postgres:your_password@localhost:5432/game_library_db"
app.config["SQLALCHEMY_TRACK_MODIFICATIONS"] = False
app.config["JWT_SECRET_KEY"] = "your_jwt_secret_key"
app.config['SECRET_KEY'] = 'your_secret_key'

# Initialize Extensions
db.init_app(app)
migrate = Migrate(app, db)
jwt = JWTManager(app)
api = Api(app)
CORS(app, resources={r"/api/*": {"origins": "*"}})



# User Signup Route
@app.route('/signup', methods=['POST'])
def user_signup():
    data = request.get_json()
    username = data.get('username')
    email = data.get('email')
    password = data.get('password')

    # Validation Checks
    if not username or not email or not password:
        return jsonify({'error': 'All fields are required'}), 400

    # Check if User already exists
    existing_user = User.query.filter_by(email=email).first()
    if existing_user:
        return jsonify({'error': 'Email already registered'}), 409

    # Create New User
    new_user = User(username=username, email=email)
    new_user.set_password(password)
    db.session.add(new_user)
    db.session.commit()

    # Generate JWT Token
    access_token = create_access_token(identity={'email': new_user.email})

    # Redirect to Home Page
    return jsonify({
        'message': 'User Signup successful',
        'access_token': access_token,
        'redirect_url': url_for('home')  # Home Page Route
    }), 201

# Owner Signup Route
@app.route('/signup/owner', methods=['POST'])
def owner_signup():
    data = request.get_json()
    name = data.get('name')
    email = data.get('email')
    password = data.get('password')

    # Validation Checks
    if not name or not email or not password:
        return jsonify({'error': 'All fields are required'}), 400

    # Check if Owner already exists
    existing_owner = Owner.query.filter_by(email=email).first()
    if existing_owner:
        return jsonify({'error': 'Email already registered'}), 409

    # Create New Owner
    new_owner = Owner(name=name, email=email)
    new_owner.set_password(password)
    db.session.add(new_owner)
    db.session.commit()

    # Generate JWT Token
    access_token = create_access_token(identity={'email': new_owner.email})

    # Redirect to Owner Dashboard
    return jsonify({
        'message': 'Owner Signup successful',
        'access_token': access_token,
        'redirect_url': url_for('owner_dashboard')  # Owner Dashboard Route
    }), 201

from flask import Flask, jsonify, request, url_for
from flask_migrate import Migrate
from flask_restful import Api, Resource
from flask_cors import CORS
from models import db, User, Owner
from flask_jwt_extended import JWTManager, create_access_token

app = Flask(__name__)
app.config["SQLALCHEMY_DATABASE_URI"] = "postgresql://postgres:your_password@localhost:5432/db_name"
app.config["SQLALCHEMY_TRACK_MODIFICATIONS"] = False
app.config["JWT_SECRET_KEY"] = "your_jwt_secret_key"
app.config["SECRET_KEY"] = "your_secret_key"

# Initialize Extensions
db.init_app(app)
migrate = Migrate(app, db)
jwt = JWTManager(app)
api = Api(app)
CORS(app, resources={r"/api/*": {"origins": "*"}})

# Class-based User Signup
class UserSignup(Resource):
    def post(self):
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

        return jsonify({
            'message': 'User Signup successful',
            'access_token': access_token,
            'redirect_url': '/home'  # Redirecting to Home Page
        }), 201


# Class-based Owner Signup
class OwnerSignup(Resource):
    def post(self):
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

        return jsonify({
            'message': 'Owner Signup successful',
            'access_token': access_token,
            'redirect_url': '/owner-dashboard'  # Redirecting to Owner Dashboard
        }), 201


# Register API Endpoints
api.add_resource(UserSignup, '/signup')
api.add_resource(OwnerSignup, '/signup/owner')

if __name__ == '__main__':
    app.run(debug=True)

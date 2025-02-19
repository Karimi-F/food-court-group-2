from flask import Flask, jsonify, request
from flask_migrate import Migrate
from flask_restful import Api, Resource
from flask_cors import CORS
from models import db, Owner, Customer
from flask_jwt_extended import JWTManager, create_access_token
from werkzeug.security import generate_password_hash, check_password_hash

app = Flask(__name__)
app.config["SQLALCHEMY_DATABASE_URI"] = "sqlite:///database.db"
app.config["SQLALCHEMY_TRACK_MODIFICATIONS"] = False
app.config["JWT_SECRET_KEY"] = "your_jwt_secret_key"  # Add a secure JWT secret key
app.config["SECRET_KEY"] = "your_secret_key"  # Add a secure secret key

# Initialize Extensions
db.init_app(app)
migrate = Migrate(app, db)
jwt = JWTManager(app)
api = Api(app)
# CORS(app, resources={r"/api/*": {"origins": "*"}})
CORS(app)

class BaseSignup(Resource):
    model = None
    redirect_url = "/"

    def post(self):
        data = request.get_json()
        name_or_username = data.get('name') or data.get('username')  # Handle both cases
        email = data.get('email')
        password = data.get('password')

        # Validation Checks
        if not name_or_username or not email or not password:
            return jsonify({'error': 'All fields are required'}), 400

        # Check if the user already exists
        existing_user = self.model.query.filter_by(email=email).first()
        if existing_user:
            return jsonify({'error': 'Email already registered'}), 409

        # Create new user or owner
        new_user = self.model(username=name_or_username, email=email) if hasattr(self.model, 'username') else self.model(name=name_or_username, email=email)
        new_user.set_password(password)  # Use the set_password method to hash the password
        db.session.add(new_user)
        db.session.commit()

        # Generate JWT Token
        access_token = create_access_token(identity={'email': new_user.email})

        return jsonify({
            'message': f'{self.model.__name__} Signup successful',
            'access_token': access_token,
            'redirect_url': self.redirect_url
        }), 201


# User Signup Class
class CustomerSignup(BaseSignup):
    model = Customer
    redirect_url = "/customerdashboard"  # Redirect to Home Page


# Owner Signup Class
class OwnerSignup(BaseSignup):
    model = Owner
    redirect_url = "/ownerdashboard"  # Redirect to Owner Dashboard


class OwnerResource(Resource):
    def get(self, id=None):
        """Retrieve all owners or a single owner by ID."""
        if id is None:
            owners = Owner.query.all()
            return [owner.to_dict() for owner in owners], 200  # ✅ No jsonify()

        owner = Owner.query.get(id)
        if not owner:
            return {"error": "Owner not found"}, 404  # ✅ No jsonify()

        return owner.to_dict(), 200  # ✅ No jsonify()

    def post(self):
        """Create a new owner."""
        data = request.get_json()
        name = data.get('name')
        email = data.get('email')
        password = data.get('password')

        if not name or not email or not password:
            return {"error": "All fields are required"}, 400  # ✅ No jsonify()

        if Owner.query.filter_by(email=email).first():
            return {"error": "Email already registered"}, 409  # ✅ No jsonify()

        # Use pbkdf2:sha256 as the hashing method
        hashed_password = generate_password_hash(password, method='pbkdf2:sha256')

        new_owner = Owner(name=name, email=email, password=hashed_password)
        db.session.add(new_owner)
        db.session.commit()

        access_token = create_access_token(identity={'email': new_owner.email})

        return {
            "message": "Owner Signup successful",
            "access_token": access_token
        }, 201  # ✅ No jsonify()

    def patch(self, id):
        """Update owner details."""
        owner = Owner.query.get(id)
        if not owner:
            return {"error": "Owner not found"}, 404  # ✅ No jsonify()

        data = request.get_json()
        if 'name' in data:
            owner.name = data['name']
        if 'email' in data:
            owner.email = data['email']
        if 'password' in data:
            # Use pbkdf2:sha256 as the hashing method
            owner.password = generate_password_hash(data['password'], method='pbkdf2:sha256')

        db.session.commit()
        return owner.to_dict(), 200  # ✅ No jsonify()

    def delete(self, id):
        """Delete an owner."""
        owner = Owner.query.get(id)
        if not owner:
            return {"error": "Owner not found"}, 404  # ✅ No jsonify()

        db.session.delete(owner)
        db.session.commit()
        return {"message": "Owner deleted successfully"}, 200  # ✅ No jsonify()


api.add_resource(OwnerResource, "/owners", "/owners/<int:id>")
api.add_resource(CustomerSignup, '/customerdashboard')
api.add_resource(OwnerSignup, '/ownerdashboard')

if __name__ == '__main__':
    app.run(debug=True)


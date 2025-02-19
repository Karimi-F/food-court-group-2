from flask import Flask, jsonify, request
from flask_migrate import Migrate
from flask_restful import Api, Resource
from flask_cors import CORS
from flask_jwt_extended import JWTManager, create_access_token
from werkzeug.security import check_password_hash
from models import db, User, Owner

# Initialize Flask app
app = Flask(__name__)

# Configuration
app.config["SQLALCHEMY_DATABASE_URI"] = "sqlite:///fitness_app.db"  # Update for production
app.config["SQLALCHEMY_TRACK_MODIFICATIONS"] = False
app.config["JWT_SECRET_KEY"] = "your_secret_key"  # Change in production

# Initialize extensions
db.init_app(app)
migrate = Migrate(app, db)
api = Api(app)
CORS(app)
jwt = JWTManager(app)

# Ensure database is created
with app.app_context():
    db.create_all()

# Owner Login API
class OwnerLogin(Resource):
    def post(self):
        data = request.get_json()
        email = data.get("email")
        password = data.get("password")

        owner = Owner.query.filter_by(email=email).first()
        if not owner or not check_password_hash(owner.password, password):
            return {"error": "Invalid credentials"}, 400

        access_token = create_access_token(identity={"email": owner.email, "is_owner": True})

        return {
            "access_token": access_token,
            "message": "Owner login successful",
            "redirect_url": "/ownerlogin/ownerdashboard"
        }

# Customer Login API
class CustomerLogin(Resource):
    def post(self):
        data = request.get_json()
        email = data.get("email")
        password = data.get("password")

        user = User.query.filter_by(email=email).first()
        if not user or not check_password_hash(user.password, password):
            return {"error": "Invalid credentials"}, 400

        access_token = create_access_token(identity={"email": user.email, "is_owner": False})

        return {
            "access_token": access_token,
            "message": "Customer login successful",
            "redirect_url": "/customerlogin/customerdashboard"
        }

# Add API Resources
api.add_resource(OwnerLogin, "/owner/login/")
api.add_resource(CustomerLogin, "/customer/login/")

# Run the app
if __name__ == "__main__":
    app.run(debug=True)

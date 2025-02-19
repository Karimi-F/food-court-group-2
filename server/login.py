from flask import Flask, jsonify, request
from flask_migrate import Migrate
from flask_restful import Api, Resource
from flask_cors import CORS
from flask_jwt_extended import JWTManager, create_access_token
from models import db, User, Owner

app = Flask(__name__)

with engine.begin() as conn:
    Base.metadata.create_all(bind=conn)

@app.route("/owner/login/", methods=["POST"])
def owner_login():
    db = next(get_db())
    data = request.get_json()
    email = data.get("email")
    password = data.get("password")
    
    user = authenticate_user(db, email, password)
    if not user or not user.is_admin:
        return jsonify({"error": "Invalid credentials"}), 400
    
    access_token = create_access_token({"sub": user.email, "is_owner": True})
    
    return jsonify({
        "access_token": access_token,
        "message": "Owner login successful",
        "redirect_url": "/ownerlogin/ownerdashboard" 
    })

@app.route("/customer/login/", methods=["POST"])
def customer_login():
    db = next(get_db())
    data = request.get_json()
    email = data.get("email")
    password = data.get("password")
    
    user = authenticate_user(db, email, password)
    if not user or user.is_admin:
        return jsonify({"error": "Invalid credentials"}), 400
    
    access_token = create_access_token({"sub": user.email, "is_owner": False})
    
    return jsonify({
        "access_token": access_token,
        "message": "Customer login successful",
        "redirect_url": "/customerlogin/customerdashboard"
    })

if __name__ == "__main__":
    app.run(debug=True)

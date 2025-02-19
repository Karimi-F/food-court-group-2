from flask import Flask, request, jsonify
from sqlalchemy.orm import Session
from auth import hash_password, create_access_token, authenticate_user
from database import get_db, engine
from models import Base, User

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
        "redirect_url": "/owner/ownerdashboard"
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
        "redirect_url": "/customer/customerdashboard"
    })

if __name__ == "__main__":
    app.run(debug=True)

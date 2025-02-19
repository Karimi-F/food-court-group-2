from flask import Flask, request, jsonify
from sqlalchemy.orm import Session
from auth import hash_password, create_access_token, authenticate_user
from database import get_db, engine
from models import Base, User

app = Flask(__name__)

with engine.begin() as conn:
    Base.metadata.create_all(bind=conn)

@app.route("/login/", methods=["POST"])
def login():
    db = next(get_db())
    data = request.get_json()
    email = data.get("email")
    password = data.get("password")
    
    user = authenticate_user(db, email, password)
    if not user:
        return jsonify({"error": "Invalid credentials"}), 400
    
    access_token = create_access_token({"sub": user.email, "is_admin": user.is_admin})
    redirect_url = "/admin/dashboard" if user.is_admin else "/client/order-dashboard"
    
    return jsonify({
        "access_token": access_token,
        "message": "Login successful",
        "redirect_url": redirect_url
    })

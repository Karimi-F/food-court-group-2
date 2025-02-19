from flask import Flask, jsonify, request
from flask_migrate import Migrate
from flask_restful import Api, Resource
from flask_cors import CORS
from flask_jwt_extended import JWTManager, create_access_token
from models import db, User, Owner

# Configuration
app.config["SQLALCHEMY_DATABASE_URI"] = "sqlite:///fitness_app.db"  # Update for production
app.config["SQLALCHEMY_TRACK_MODIFICATIONS"] = False
app.config["JWT_SECRET_KEY"] = "your_secret_key"  # Change in productio
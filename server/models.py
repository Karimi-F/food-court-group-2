from datetime import datetime 
from flask_sqlalchemy import SQLAlchemy
from sqlalchemy.orm import relationship
from sqlalchemy_serializer import SerializerMixin

db = SQLAlchemy()

# Customer Model
class Customer(db.Model):
    __tablename__ = 'customers'
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100))
    email = db.Column(db.String(100), unique=True)
    password = db.Column(db.String(200))
    # Define relationship to orders. SQLAlchemy will use the foreign key on Order.
    orders = db.relationship('Order', backref='customer', lazy=True)

# Owner Model
class Owner(db.Model, SerializerMixin):
    __tablename__ = 'owners'
    
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String, nullable=False)
    email = db.Column(db.String, unique=True, nullable=False)
    password = db.Column(db.String, nullable=False)
    
    # One owner can have multiple outlets
    outlets = relationship('Outlet', back_populates='owner', cascade="all, delete-orphan")
    
    # Serialization rules
    serialize_rules = ('-password', '-outlets.owner')

# Outlet Model
class Outlet(db.Model, SerializerMixin):
    __tablename__ = 'outlets'
    
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String, unique=True, nullable=False)
    photo_url = db.Column(db.String, nullable=True)
    # Foreign key linking to Owner
    owner_id = db.Column(db.Integer, db.ForeignKey('owners.id'), nullable=False)
    
    # Relationship to Owner
    owner = relationship('Owner', back_populates='outlets')
    
    # One outlet can have many food items
    foods = relationship('Food', back_populates='outlet', cascade="all, delete-orphan")
    
    # Serialization rules
    serialize_rules = ('-owner.outlets', '-foods.outlet')

# Table Reservation Model
class TableReservation(db.Model, SerializerMixin):
    __tablename__ = 'table_reservations'
    
    id = db.Column(db.Integer, primary_key=True)
    table_name = db.Column(db.String, nullable=False)
    
    # One table reservation can have one order
    orders = relationship('Order', back_populates='table_reservation', cascade="all, delete-orphan")
    
    # Serialization rules
    serialize_rules = ('-orders.table_reservation',)

# Food Model
class Food(db.Model, SerializerMixin):
    __tablename__ = 'foods'
    
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String, nullable=False)
    price = db.Column(db.Float, nullable=False)
    waiting_time = db.Column(db.String, nullable=False)
    category = db.Column(db.String,nullable=True)
    # Foreign key linking to Outlet
    outlet_id = db.Column(db.Integer, db.ForeignKey('outlets.id'), nullable=False)
    
    # Relationship to Outlet
    outlet = relationship('Outlet', back_populates='foods')
    
    # One food item can be part of many orders
    orders = relationship('Order', back_populates='food', cascade="all, delete-orphan")
    
    # Serialization rules
    serialize_rules = ('-outlet.foods', '-orders.food')

# Order Model

class Order(db.Model):
    __tablename__ = 'orders'
    id = db.Column(db.Integer, primary_key=True)
    # Add a foreign key linking to the Customer table.
    customer_id = db.Column(db.Integer, db.ForeignKey('customers.id'), nullable=True)
    table_id = db.Column(db.Integer, nullable=False)  # or adjust field name as needed
    datetime = db.Column(db.DateTime, nullable=False)
    total = db.Column(db.Float, nullable=False)
    status = db.Column(db.String(50), default="pending")
    
    def to_dict(self):
        return {
            "id": self.id,
            "customer_id": self.customer_id,
            "table_id": self.table_id,
            "datetime": self.datetime.isoformat(),
            "total": self.total,
            "status": self.status,
        }

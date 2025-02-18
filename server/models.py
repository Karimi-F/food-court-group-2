from datetime import datetime
from flask_sqlalchemy import SQLAlchemy
from sqlalchemy.orm import relationship
from sqlalchemy_serializer import SerializerMixin

db = SQLAlchemy()

# Customer Model
class Customer(db.Model, SerializerMixin):
    __tablename__ = 'customers'

    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String, nullable=False)
    email = db.Column(db.String, unique=True, nullable=False)
    password = db.Column(db.String, nullable=False)
    
    # One customer can have many orders
    orders = relationship('Order', back_populates='customer', cascade="all, delete-orphan")

# Owner Model
class Owner(db.Model, SerializerMixin):
    __tablename__ = 'owners'

    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String, nullable=False)
    email = db.Column(db.String, unique=True, nullable=False)
    password = db.Column(db.String, nullable=False)
    
    # One owner can have multiple outlets
    outlets = relationship('Outlet', back_populates='owner', cascade="all, delete-orphan")

# Outlet Model
class Outlet(db.Model, SerializerMixin):
    __tablename__ = 'outlets'

    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String, unique=True, nullable=False)
    
    # Foreign key linking to Owner
    owner_id = db.Column(db.Integer, db.ForeignKey('owners.id'), nullable=False)
    
    # Relationship to Owner
    owner = relationship('Owner', back_populates='outlets')
    
    # One outlet can have many food items and table reservations
    foods = relationship('Food', back_populates='outlet', cascade="all, delete-orphan")
    table_reservations = relationship('TableReservation', back_populates='outlet', cascade="all, delete-orphan")

# Table Reservation Model
class TableReservation(db.Model, SerializerMixin):
    __tablename__ = 'table_reservations'

    id = db.Column(db.Integer, primary_key=True)
    table_name = db.Column(db.String, nullable=False)
    
<<<<<<< HEAD
    # Foreign key linking to Outlet
    # outlet_id = db.Column(db.Integer, db.ForeignKey('outlets.id'), nullable=False)
    # waiter_id = db.Column(db.Integer, nullable=False)
    
=======
>>>>>>> 434ee5a (update my models code)
    # Relationship to Outlet
    # outlet = relationship('Outlet', back_populates='table_reservations')
    
    # One table reservation can have one order
    orders = relationship('Order', back_populates='table_reservation', cascade="all, delete-orphan")

# Food Model
class Food(db.Model, SerializerMixin):
    __tablename__ = 'foods'

    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String, nullable=False)
    price = db.Column(db.Float, nullable=False)
    waiting_time = db.Column(db.String, nullable=False)
    
    # Foreign key linking to Outlet
    outlet_id = db.Column(db.Integer, db.ForeignKey('outlets.id'), nullable=False)
    
    # Relationship to Outlet
<<<<<<< HEAD
    outlet = relationship('Outlet', back_populates='foods')
=======
    outlet = relationship('Outlet', back_populates='food')
>>>>>>> 434ee5a (update my models code)
    
    # One food item can be part of many orders
    orders = relationship('Order', back_populates='food', cascade="all, delete-orphan")

# Order Model
class Order(db.Model, SerializerMixin):
    __tablename__ = 'orders'

    id = db.Column(db.Integer, primary_key=True)
    
    # Foreign key linking to Customer
    customer_id = db.Column(db.Integer, db.ForeignKey('customers.id'), nullable=False)
    
    # Foreign key linking to TableReservation
    tablereservation_id = db.Column(db.Integer, db.ForeignKey('table_reservations.id'), unique=True, nullable=False)
    
    # Foreign key linking to Food
    food_id = db.Column(db.Integer, db.ForeignKey('foods.id'), nullable=False)
    
    quantity = db.Column(db.Integer, nullable=False)
    status = db.Column(db.String, nullable=False)
    datetime = db.Column(db.DateTime, default=datetime.utcnow)
    
    # Relationship to Customer
    customer = relationship('Customer', back_populates='orders')
    
    # Relationship to Table Reservation
    table_reservation = relationship('TableReservation', back_populates='orders')
    
    # Relationship to Food
    food = relationship('Food', back_populates='orders')

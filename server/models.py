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

    def to_dict(self):
            return {
                "id": self.id,
                "name": self.name,
                "email": self.email
            }

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
    photo_url = db.Column(db.String, nullable=False)
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
    
    # One table reservation can have one order (one-to-one relationship)
    order = db.relationship(
        'Order',
        back_populates='table_reservation',
        uselist=False,
        cascade="all, delete-orphan"
    )
    
    # Serialization rules (exclude the order to avoid circular references)
    serialize_rules = ('-order',)

# Food Model
class Food(db.Model, SerializerMixin):
    __tablename__ = 'foods'
    
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String, nullable=False)
    price = db.Column(db.Float, nullable=False)
    waiting_time = db.Column(db.String, nullable=False)
    category = db.Column(db.String, nullable=True)
    # Foreign key linking to Outlet
    outlet_id = db.Column(db.Integer, db.ForeignKey('outlets.id'), nullable=False)
    
    # Relationship to Outlet
    outlet = db.relationship('Outlet', back_populates='foods')
    
    # (Note: The previous relationship to Order has been removed. 
    # Typically an Order would reference multiple foods via an association table.)
    
    # Serialization rules
    serialize_rules = ('-outlet.foods',)

# Order Model
class Order(db.Model):
    __tablename__ = 'orders'
    id = db.Column(db.Integer, primary_key=True)
    # Enforce that each order must have a customer; if a customer is deleted, its orders are also removed.
    customer_id = db.Column(db.Integer, db.ForeignKey('customers.id', ondelete='CASCADE'), nullable=False)
    table_id = db.Column(db.Integer, db.ForeignKey('table_reservations.id', ondelete='CASCADE'), nullable=False)
    datetime = db.Column(db.DateTime, nullable=False)
    total = db.Column(db.Float, nullable=False)
    status = db.Column(db.String(50), default="pending")
    
    # Relationship to TableReservation (one-to-one)
    table_reservation = db.relationship('TableReservation', back_populates='order', passive_deletes=True)
    
    def to_dict(self):
        return {
            "id": self.id,
            "customer_id": self.customer_id,
            "table_id": self.table_id,
            "datetime": self.datetime.isoformat(),
            "total": self.total,
            "status": self.status,
        }

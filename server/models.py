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

    def to_dict(self):
        return {
                "id": self.id,
                "name": self.name,
                "email": self.email
            }

# Outlet Model
class Outlet(db.Model, SerializerMixin):
    __tablename__ = 'outlets'
    
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String, unique=True, nullable=False)
    description = db.Column(db.String, nullable=True)
    photo_url = db.Column(db.String, nullable=False)
    # Foreign key linking to Owner
    owner_id = db.Column(db.Integer, db.ForeignKey('owners.id'), nullable=False)
    
    # Relationship to Owner
    owner = relationship('Owner', back_populates='outlets')
    
    # One outlet can have many food items
    foods = relationship('Food', back_populates='outlet', cascade="all, delete-orphan")

    order_items = db.relationship('OrderItem', back_populates='outlet')

    # Serialization rules
    serialize_rules = ('-owner.outlets', '-foods.outlet')

    def to_dict(self):
        return {
            "id": self.id,
            "name": self.name,
            "description": self.description,
            "owner_id": self.owner_id,
            "photo_url": self.photo_url
        }

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

    order_items = db.relationship('OrderItem', back_populates='table_reservation')
    
    # Serialization rules (exclude the order to avoid circular references)
    serialize_rules = ('-order',)

    def to_dict(self):
        return{
            "id" : self.id,
            "table_name" : self.table_name
        }

# Food Model
class Food(db.Model, SerializerMixin):
    __tablename__ = 'foods'
    
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String, nullable=False)
    price = db.Column(db.Float, nullable=False)
    waiting_time = db.Column(db.String, nullable=False)
    category = db.Column(db.String, nullable=True)
    photo_url = db.Column(db.String, nullable=False)
    # Foreign key linking to Outlet
    outlet_id = db.Column(db.Integer, db.ForeignKey('outlets.id'), nullable=False)
    
    # Relationship to Outlet
    outlet = db.relationship('Outlet', back_populates='foods')
    
    # (Note: The previous relationship to Order has been removed. 
    # Typically an Order would reference multiple foods via an association table.)
    order_items = db.relationship('OrderItem', back_populates='food')
    # Serialization rules
    serialize_rules = ('-outlet.foods',)

    def to_dict(self):
        return{
            "id" : self.id,
            "name" : self.name,
            "price" : self.price,
            "waiting_time" : self.waiting_time,
            "category" : self.category,
            "photo_url" :self.photo_url
        }

# Order Model
class Order(db.Model):
    __tablename__ = 'orders'
    id = db.Column(db.Integer, primary_key=True)
    # Foreign key linking to Customer
    customer_id = db.Column(db.Integer, db.ForeignKey('customers.id', ondelete='SET NULL'), nullable=False)
    # Foreign key linking to TableReservation
    tablereservation_id = db.Column(db.Integer, db.ForeignKey('table_reservations.id', ondelete='CASCADE'), nullable=False)
    datetime = db.Column(db.DateTime, nullable=False)
    total = db.Column(db.Float, nullable=False)
    status = db.Column(db.String(50), default="pending")
    
    # Relationship to TableReservation (one-to-one)
    table_reservation = db.relationship('TableReservation', back_populates='order', passive_deletes=True)
    order_items = db.relationship('OrderItem', back_populates='order', lazy=True)
    
    def to_dict(self):
        return {
            "id": self.id,
            "customer_id": self.customer_id,
            "tablereservation_id": self.tablereservation_id,
            "datetime": self.datetime.isoformat(),
            "total": self.total,
            "status": self.status,
        }

class OrderItem(db.Model):
     __tablename__ = 'order_items'
     id = db.Column(db.Integer, primary_key=True)
     order_id = db.Column(db.Integer, db.ForeignKey('orders.id', ondelete='CASCADE'), nullable=False)
     outlet_id = db.Column(db.Integer, db.ForeignKey('outlets.id', ondelete='CASCADE'), nullable=False)
     food_id = db.Column(db.Integer, db.ForeignKey('foods.id', ondelete='CASCADE'), nullable=False)
     quantity = db.Column(db.Integer, nullable=False)
     total_price = db.Column(db.Float, nullable=False)
     tablereservation_id = db.Column(db.Integer, db.ForeignKey('table_reservations.id', ondelete='CASCADE'), nullable=False)

     order = db.relationship('Order', back_populates='order_items')
     outlet = db.relationship('Outlet', back_populates='order_items')
     food = db.relationship('Food', back_populates='order_items')
     table_reservation = db.relationship('TableReservation', back_populates='order_items')

     def to_dict(self):
          return{
               "order_id": self.order_id,
               "outlet_id": self.outlet_id,
               "food_id": self.food_id,
               "quantity": self.quantity,
               "total_price": self.total_price,
               "tablereservation_id": self.tablereservation_id
          }
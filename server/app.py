from flask import Flask, request, jsonify, session, make_response
from flask_migrate import Migrate
from flask_restful import Api, Resource, reqparse
from flask_cors import CORS
from models import db, Owner, Customer, Outlet, Food, Order, TableReservation, OrderItem
from flask_jwt_extended import JWTManager, create_access_token, jwt_required, get_jwt
from werkzeug.security import generate_password_hash, check_password_hash
# from datetime import datetime, timedelta
from datetime import datetime, timedelta

import json

app = Flask(__name__)

app.config["SQLALCHEMY_DATABASE_URI"] = "postgresql://karimi:123456@localhost:5432/food_court_db"
app.config["SQLALCHEMY_TRACK_MODIFICATIONS"] = False
app.config["JWT_SECRET_KEY"] = "your_jwt_secret_key"  # Add a secure JWT secret key
app.config["SECRET_KEY"] = "your_secret_key"          # Add a secure secret key

# Initialize Extensions
db.init_app(app)
migrate = Migrate(app, db)
jwt = JWTManager(app)
api = Api(app)
CORS(app)

# Store revoked tokens (use a database in production)
blacklist = set()

# -------------------------
# Other Resources (Signup, Login, Owner, Customer, Outlet, Foods, etc.)
# -------------------------

class BaseSignup(Resource):
    model = None
    redirect_url = "/"

    def post(self):
        data = request.get_json()
        name_or_username = data.get('name') or data.get('username')
        email = data.get('email')
        password = data.get('password')
        password2 = data.get('password2')

        if not name_or_username or not email or not password or not password2:
            return {'error': 'All fields are required'}, 400

        existing_user = self.model.query.filter_by(email=email).first()
        if existing_user:
            return {'error': 'Email already registered'}, 409

        if password != password2:
            return {"error": "Passwords do not match!"}, 400    

        if hasattr(self.model, 'username'):
            new_user = self.model(username=name_or_username, email=email)
        else:
            new_user = self.model(name=name_or_username, email=email)
        new_user.set_password(password)
        db.session.add(new_user)
        db.session.commit()

        # Store user data in session
        session['user_id'] = new_user.id  
        session['logged_in'] = True

        access_token = create_access_token(identity={'email': new_user.email})
        session['access_token'] = access_token

        return {
            'message': f'{self.model.__name__} Signup successful',
            'access_token': access_token,
            'redirect_url': self.redirect_url
        }, 201

class CustomerSignup(BaseSignup):
    model = Customer
    redirect_url = "/customer-dashboard"

class OwnerSignup(BaseSignup):
    model = Owner
    redirect_url = "/owner-dashboard"  # Redirect to Owner Dashboard

class OwnerResource(Resource):
    def get(self, id=None):
        if id is None:
            owners = Owner.query.all()
            return [owner.to_dict() for owner in owners], 200
        owner = Owner.query.get(id)
        if not owner:
            return {"error": "Owner not found"}, 404
        return owner.to_dict(), 200
    
    def post(self):
        data = request.get_json()
        name = data.get('name')
        email = data.get('email')
        password = data.get('password')

        if not name or not email or not password:
            return {"error": "All fields are required"}, 400

        if Owner.query.filter_by(email=email).first():
            return {"error": "Email already registered"}, 409

        hashed_password = generate_password_hash(password, method='pbkdf2:sha256')
        new_owner = Owner(name=name, email=email, password=hashed_password)
        db.session.add(new_owner)
        db.session.commit()

        return new_owner.to_dict(), 200

    def patch(self, id):
        owner = Owner.query.get(id)
        if not owner:
            return {"error": "Owner not found"}, 404

        data = request.get_json()
        if 'name' in data:
            owner.name = data['name']
        if 'email' in data:
            owner.email = data['email']
        if 'password' in data:
            owner.password = generate_password_hash(data['password'], method='pbkdf2:sha256')

        db.session.commit()
        return owner.to_dict(), 200

    def delete(self, id):
        owner = Owner.query.get(id)
        if not owner:
            return {"error": "Owner not found"}, 404
        db.session.delete(owner)
        db.session.commit()
        return {"message": "Owner deleted successfully"}, 200

class CustomerResource(Resource):
    def get(self, id=None):
        if id is None:
            customers = Customer.query.all()
            return [customer.to_dict() for customer in customers], 200
        customer = Customer.query.get(id)
        if not customer:
            return {"error": "Customer not found"}, 404
        return customer.to_dict(), 200
    
    def post(self):
        data = request.get_json()
        name = data.get('name')
        email = data.get('email')
        password = data.get('password')

        if not name or not email or not password:
            return {"error": "All fields are required"}, 400

        if Customer.query.filter_by(email=email).first():
            return {"error": "Email already registered"}, 409

        hashed_password = generate_password_hash(password, method='pbkdf2:sha256')
        new_customer = Customer(name=name, email=email, password=hashed_password)
        db.session.add(new_customer)
        db.session.commit()

        return new_customer.to_dict(), 200

class Login(Resource):
    def post(self):
        data = request.get_json()
        email = data.get("email")
        password = data.get("password")

        user = Owner.query.filter_by(email=email).first() or Customer.query.filter_by(email=email).first()
        if not user or not check_password_hash(user.password, password):
            return {"error": "Invalid credentials"}, 400

        is_owner = isinstance(user, Owner)
        access_token = create_access_token(identity={"email": user.email, "is_owner": is_owner})

        response_data = {
            "access_token": access_token,
            "id": user.id,
            "name": user.name, 
            "email": user.email,
            "role": "owner" if is_owner else "customer",
            "message": "login successfully",
        }

        return make_response(jsonify(response_data), 200)
    
class Logout(Resource):
    def post(self):
        session.pop('user_id', None)
        session.pop('user', None)
        return jsonify({'message': 'Logged out successfully'}), 200

# -------------------------------
# Outlet Endpoints
# -------------------------------
class OutletResource(Resource):
    def get(self, id=None):
        if id is None:
            name = request.args.get('name')
            if name:
                outlets = Outlet.query.filter(Outlet.name.ilike(f"%{name}%")).all()
                if not outlets:
                    return {"error": "Outlet not found"}, 404
                return [o.to_dict() for o in outlets], 200
            outlets = Outlet.query.all()
            return [outlet.to_dict() for outlet in outlets], 200
        outlet = Outlet.query.get(id)
        if not outlet:
            return {"error": "Outlet not found"}, 404
        return outlet.to_dict(), 200

    def post(self):
        data = request.get_json()
        name = data.get('name')
        description = data.get('description')
        owner_id = data.get('owner_id')
        photo_url = data.get('photo_url')
        if not name or not owner_id:
            return {"error": "Name and owner_id are required"}, 400

        if Outlet.query.filter_by(name=name).first():
            return {"error": "Outlet with this name already exists"}, 409

        new_outlet = Outlet(name=name, owner_id=owner_id, photo_url=photo_url, description=description)
        db.session.add(new_outlet)
        db.session.commit()

        return new_outlet.to_dict(), 201


    def patch(self, id):
        outlet = Outlet.query.get(id)
        if not outlet:
            return {"error": "Outlet not found"}, 404

        data = request.get_json()
        
        # Update only the fields that are provided
        if 'name' in data:
            if Outlet.query.filter(Outlet.name == data['name']).first():
                return {"error": "Outlet with this name already exists"}, 409
            outlet.name = data['name']
        
        if 'description' in data:
            outlet.description = data['description']
        
        if 'photo_url' in data:
            outlet.photo_url = data['photo_url']
        
        db.session.commit()

        return outlet.to_dict(), 200    

# -------------------------------
# Food Endpoints (Collection)
# -------------------------------
class FoodsResource(Resource):
    def get(self):
        try:
            foods = Food.query.all()
            foods_list = [food.to_dict() for food in foods]
            return foods_list, 200
        except Exception as e:
            return {"message": str(e)}, 500

    def post(self):
        data = request.get_json()
        name = data.get('name')
        price = data.get('price')
        waiting_time = data.get('waiting_time')
        category = data.get('category')
        category=data.get('category')
        photo_url = data.get('photo_url')
        outlet_id = data.get('outlet_id')

        # Validate required fields
        if not name or price is None or waiting_time is None or outlet_id is None or photo_url is None:
            return {"error": "Name, price, waiting_time, outlet_id, and photo_url are required"}, 400

        if Food.query.filter_by(name=name).first():
            return {"error": "Food already exists"}, 409
        
        new_food = Food(name=name, price=price, waiting_time=waiting_time, category=category, outlet_id=outlet_id)
        db.session.add(new_food)
        db.session.commit()

        return {"message": "Food created successfully", "food": new_food.to_dict()}, 201

# -------------------------------
# Food Endpoints (Single Item by ID)
# -------------------------------
class FoodResource(Resource):
    def get(self, id):
        food = Food.query.get(id)
        if not food:
            return {"error": "Food not found"}, 404
        return food.to_dict(), 200

    def put(self, id):
        """
        Full update of a food item.
        All fields (name, price, waiting_time, category, outlet_id) are required.
        """
        food = Food.query.get(id)
        if not food:
            return {"error": "Food not found"}, 404

        data = request.get_json()
        name = data.get('name')
        price = data.get('price')
        waiting_time = data.get('waiting_time')
        category = data.get('category')
        photo_url = data.get('photo_url')
        outlet_id = data.get('outlet_id')

        if not name or price is None or waiting_time is None or outlet_id is None or photo_url is None:
            return {"error": "All fields (name, price, waiting_time, outlet_id, photo_url) are required"}, 400

        # Check if another food with the new name exists
        if Food.query.filter(Food.name == name, Food.id != id).first():
            return {"error": "Food with this name already exists"}, 409

        food.name = name
        food.price = price
        food.waiting_time = waiting_time
        food.category = category
        food.photo_url = photo_url
        food.outlet_id = outlet_id

        db.session.commit()
        return {"message": "Food updated successfully", "food": food.to_dict()}, 200

    def patch(self, id):
        """
        Partial update of a food item.
        Only the provided fields will be updated.
        """
        food = Food.query.get(id)
        if not food:
            return {"error": "Food not found"}, 404

        data = request.get_json()
        if not data:
            return {"error": "No update data provided"}, 400

        if 'name' in data:
            new_name = data['name']
            # Check for duplicate name on a different record
            if Food.query.filter(Food.name == new_name, Food.id != id).first():
                return {"error": "Food with this name already exists"}, 409
            food.name = new_name
        if 'price' in data:
            food.price = data['price']
        if 'waiting_time' in data:
            food.waiting_time = data['waiting_time']
        if 'category' in data:
            food.category = data['category']
        if 'photo_url' in data:
            food.photo_url = data['photo_url']
        if 'outlet_id' in data:
            food.outlet_id = data['outlet_id']

        db.session.commit()
        return {"message": "Food partially updated successfully", "food": food.to_dict()}, 200

    def delete(self, id):
        food = Food.query.get(id)
        if not food:
            return {"error": "Food not found"}, 404

        db.session.delete(food)
        db.session.commit()
        return {"message": "Food deleted successfully"}, 200

# -------------------------------
# Additional Lookup Endpoints
# -------------------------------
class FoodByNameResource(Resource):
    def get(self, name=None, food_id=None):
        try:
            if food_id is not None:  # If food_id is provided, fetch by ID
                food = Food.query.get(food_id)
                if food:
                    return food.to_dict(), 200
                return {"message": "Food not found"}, 404

            elif name is not None:  # Otherwise, fetch by name
                food = Food.query.filter_by(name=name).first()
                if food:
                    return food.to_dict(), 200
                return {"message": "Food not found"}, 404

            return {"message": "Invalid request, provide food name or ID"}, 400
        except Exception as e:
            return {"message": str(e)}, 500

    def put(self, name):
        """
        Full update of a food item located by name.
        (Use with caution since names may change.)
        """
        food = Food.query.filter_by(name=name).first()
        if not food:
            return {"error": "Food not found"}, 404

        data = request.get_json()
        new_name = data.get('name')
        price = data.get('price')
        waiting_time = data.get('waiting_time')
        category = data.get('category')
        photo_url = data.get('photo_url')
        outlet_id = data.get('outlet_id')

        if not new_name or price is None or waiting_time is None or outlet_id is None or photo_url is None:
            return {"error": "All fields (name, price, waiting_time, outlet_id) are required"}, 400

        # Check if another food with the new name exists (if name is changing)
        if new_name != name and Food.query.filter_by(name=new_name).first():
            return {"error": "Food with this name already exists"}, 409

        food.name = new_name
        food.price = price
        food.waiting_time = waiting_time
        food.category = category
        food.photo_url = photo_url
        food.outlet_id = outlet_id

        db.session.commit()
        return {"message": "Food updated successfully", "food": food.to_dict()}, 200

    def patch(self, food_id):
        # Fetch food by ID
        food = Food.query.get(food_id)
        if not food:
            return {"error": "Food not found"}, 404

        # Get the JSON data from the request
        data = request.get_json()
        if not data:
            return {"error": "No update data provided"}, 400

        # Update the food item with the new values from the request
        if 'name' in data:
            new_name = data['name']
            if Food.query.filter(Food.name == new_name, Food.id != food.id).first():
                return {"error": "Food with this name already exists"}, 409
            food.name = new_name
        if 'price' in data:
            food.price = data['price']
        if 'waiting_time' in data:
            food.waiting_time = data['waiting_time']
        if 'category' in data:
            food.category = data['category']
        if 'photo_url' in data:
            food.photo_url = data['photo_url']
        if 'outlet_id' in data:
            food.outlet_id = data['outlet_id']

        # Commit the changes to the database
        db.session.commit()

        # Return the updated food item
        return {'message': 'Food updated successfully', 'food': food.to_dict()}, 200
    
    def delete(self, name):
        food = Food.query.filter_by(name=name).first()
        if not food:
            return {"error": "Food not found"}, 404

        db.session.delete(food)
        db.session.commit()
        return {"message": "Food deleted successfully"}, 200

class FoodByOutletResource(Resource):
    def get(self, outlet_id):
        try:
            food_items = Food.query.filter_by(outlet_id=outlet_id).all()
            if food_items:
                return [food.to_dict() for food in food_items], 200
            return {"message": "No food found for this outlet"}, 404
        except Exception as e:
            return {"message": str(e)}, 500

class FoodByIDResource(Resource):
    def get(self, food_id=None):
        try:
            if food_id is not None:  # Fetch by ID
                food = Food.query.get(food_id)
                if food:
                    return food.to_dict(), 200
                return {"message": "Food not found"}, 404
            return {"message": "Invalid request, provide food ID"}, 400
        except Exception as e:
            return {"message": str(e)}, 500

    def patch(self, food_id):
        try:
            if food_id is None:
                return {"message": "Invalid request, provide food ID"}, 400

            # Fetch the food item by ID
            food = Food.query.get(food_id)
            if not food:
                return {"message": "Food not found"}, 404

            # Get the JSON data from the request
            data = request.get_json()
            if not data:
                return {"message": "No data provided for update"}, 400

            # Update the food item with the provided data
            if "name" in data:
                food.name = data["name"]
            if "waiting_time" in data:  # Correct the field name
                food.waiting_time = data["waiting_time"]
            if "price" in data:
                food.price = data["price"]
            if "category" in data:  # Correct the field name
                food.category = data["category"]
            if "photo_url" in data:  # Correct the field name
                food.photo_url = data["photo_url"]

            # Save the changes to the database
            db.session.commit()

            return food.to_dict(), 200  # Return the updated food item

        except Exception as e:
            db.session.rollback()  # Rollback in case of an error
            return {"message": str(e)}, 500

    def delete(self, food_id):
        try:
            food = Food.query.get(food_id)
            if not food:
                return {"message": "Food not found"}, 404

            db.session.delete(food)
            db.session.commit()

            return {"message": f"Food with ID {food_id} deleted successfully"}, 200
        except Exception as e:
            db.session.rollback()  # Rollback in case of an error
            return {"message": str(e)}, 500
            
# Resource to get food by price
class FoodByPriceResource(Resource):
    def get(self, price):
        try:
            food = Food.query.filter_by(price=price).first()
            if food:
                return food.to_dict(), 200
            return {"message": "Food with the specified price not found"}, 404
        except Exception as e:
            return {"message": str(e)}, 500

# ------------------------------------------------
# Updated OrdersResource for customer dashboard and status updates
# ------------------------------------------------
class OrdersResource(Resource):
    def post(self):
        data = request.get_json()

        customer_id = data.get('customer_id')
        tablereservation_id = data.get('tablereservation_id')
        datetime_str = data.get('datetime')
        items_data = data.get('items')

        # Parse datetime string into a Python datetime object
        try:
            order_datetime = datetime.fromisoformat(datetime_str)
        except ValueError:
            return jsonify({"error": "Invalid datetime format"}), 400

        # Fetch customer and reservation (ensure they exist)
        customer = Customer.query.get(customer_id)
        if not customer:
            return jsonify({"error": "Customer not found"}), 404

        table_reservation = TableReservation.query.get(tablereservation_id)
        if not table_reservation:
            return jsonify({"error": "Table reservation not found"}), 404

        # Create new order
        total = 0.0
        order = Order(
            customer_id=customer_id,
            tablereservation_id=tablereservation_id,
            datetime=order_datetime,
            total=total,  # We'll update this later
            status="pending"
        )

        for outlet_group in items_data:
            outlet_id = outlet_group.get('outlet_id')
            outlet = Outlet.query.get(outlet_id)
            if not outlet:
                return jsonify({"error": f"Outlet with ID {outlet_id} not found"}), 404
            
            for food_data in outlet_group.get('items', []):
                food_id = food_data.get('food_id')
                quantity = food_data.get('quantity')
                price = food_data.get('price')

                food = Food.query.get(food_id)
                if not food:
                    return jsonify({"error": f"Item with ID {food_id} not found"}), 404
                
                if price is None:
                    return jsonify({"error": f"Price for food item {food_id} is missing or invalid"}), 400
                if quantity is None:
                    return jsonify({"error": f"Quantity for food item {food_id} is missing or invalid"}), 400
        
                try:
                    price = float(price)  # Ensure price is a float
                except ValueError:
                     return jsonify({"error": f"Price for food item {food_id} is not a valid number"}), 400

                if not isinstance(quantity, int):
                    return jsonify({"error": f"Quantity for food item {food_id} should be an integer"}), 400


                # Calculate total price
                total_price = price * quantity

                total += total_price

                # Create order items
                order_item = OrderItem(
                    order=order,
                    food_id=food_id,
                    outlet_id=outlet_id,
                    quantity=quantity,
                    total_price=total_price,
                    tablereservation_id=tablereservation_id
                )
                db.session.add(order_item)

        # Update the total price for the order
        order.total = total
        db.session.add(order)
        db.session.commit()

        order_dict = order.to_dict()
        print(order_dict)

        return jsonify(order_dict), 201
    # def post(self):
    #     data = request.get_json()
    #     if not data:
    #         return {"error": "No input data provided"}, 400

    #     try:
    #         table_id = data.get('tableId')
    #         datetime_str = data.get('datetime')
    #         total = data.get('total')
    #         customer_id = data.get('customer_id', None)

    #         if not customer_id:
    #             return {"error":"customer_id is required"}, 400

    #         # Convert the datetime string into a datetime object.
    #         order_datetime = datetime.strptime(datetime_str, "%Y-%m-%dT%H:%M")

    #         new_order = Order(
    #             customer_id=customer_id,
    #             tablereservation_id=table_id,
    #             datetime=order_datetime,
    #             total=total,
    #             status="pending"
    #         )

    #         db.session.add(new_order)
    #         db.session.commit()
    #         return new_order.to_dict(), 201

    #     except Exception as e:
    #         db.session.rollback()
    #         return {"error": str(e)}, 500

    def get(self, id=None):
        # If a customer_id query parameter is provided, filter orders for that customer
        customer_id = request.args.get('customer_id')
        if customer_id:
            orders = Order.query.filter_by(customer_id=customer_id).all()
            if not orders:
                return {"message": "No orders found for this customer"}, 404
            return [order.to_dict() for order in orders], 200

        # Otherwise, if a specific order id is provided, return that order
        if id:
            order = Order.query.get(id)
            if not order:
                return {"error": "Order not found"}, 404
            return order.to_dict(), 200

        # Return all orders (for administrative purposes)
        orders = Order.query.all()
        return [order.to_dict() for order in orders], 200

    def patch(self, id=None):
        if id is None:
            return {"error": "Order ID is required for PATCH requests."}, 400

        order = Order.query.get(id)
        if not order:
            return {"error": "Order not found"}, 404

        data = request.get_json()
        if not data:
            return {"error": "No update data provided"}, 400

        # Update the order status if provided.
        # Expected statuses could be "confirmed", "served", "completed"
        if "status" in data:
            order.status = data["status"]

        # Optionally, update additional order details if necessary
        # e.g., updating cart details if those fields are part of the order model

        db.session.commit()
        return order.to_dict(), 200

    def delete(self, id=None):
        if id is None:
            return {"error": "Order ID is required for DELETE requests."}, 400

        order = Order.query.get(id)
        if not order:
            return {"error": "Order not found"}, 404

        db.session.delete(order)
        db.session.commit()
        return {"message": "Order deleted successfully"}, 200

class OwnerOutletResource(Resource):
    def get(self, owner_id):  # Accept owner_id from URL
        owner = Owner.query.get(owner_id)
        if not owner:
            return {"message": "Owner not found"}, 404

        # Get all outlets owned by this owner
        outlets = Outlet.query.filter_by(owner_id=owner_id).all()
        if not outlets:
            return {"message": "No outlets found for this owner"}, 404

        return jsonify([outlet.to_dict() for outlet in outlets])
    
    def calculate_total(order_items):
        return sum(item["total_price"] for order in order_items for item in order['items'])


class TableReservationResource(Resource):
    def get(self, id=None):
        if id is None:
            table_name = request.args.get('table_name')
            if table_name:
                reservations = TableReservation.query.filter(TableReservation.table_name.ilike(f"%{table_name}%")).all()
                if not reservations:
                    return {"error": "Reservation not found"}, 404
                return [res.to_dict() for res in reservations], 200
            reservations = TableReservation.query.all()
            return [reservation.to_dict() for reservation in reservations], 200
        
        reservation = TableReservation.query.get(id)
        if not reservation:
            return {"error": "Reservation not found"}, 404
        return reservation.to_dict(), 200

    def post(self):
        data = request.get_json()
        table_name = data.get('table_name')
        
        if not table_name:
            return {"error": "Table name is required"}, 400

        new_reservation = TableReservation(table_name=table_name)
        db.session.add(new_reservation)
        db.session.commit()

        return new_reservation.to_dict(), 201

    def put(self, id):
        reservation = TableReservation.query.get(id)
        if not reservation:
            return {"error": "Reservation not found"}, 404
        
        data = request.get_json()
        reservation.table_name = data.get('table_name', reservation.table_name)
        
        db.session.commit()
        return reservation.to_dict(), 200

    def delete(self, id):
        reservation = TableReservation.query.get(id)
        if not reservation:
            return {"error": "Reservation not found"}, 404
        
        db.session.delete(reservation)
        db.session.commit()
        return {"message": "Reservation deleted successfully"}, 200

class TableAvailability(Resource):
    def get(self, table_id):  # Ensure table_id is included as a parameter
        datetime_str = request.args.get("datetime")

        if not datetime_str:
            return {"error": "Missing datetime parameter"}, 400

        try:
            # Parse the input datetime string
            input_datetime = datetime.fromisoformat(datetime_str)
            # Extract just the date part (ignoring the time)
            input_date = input_datetime.date()

            # Calculate the start and end of the day
            start_of_day = datetime(input_date.year, input_date.month, input_date.day, 0, 0, 0)
            end_of_day = start_of_day + timedelta(days=1)

            # Query the database for any orders matching the table_id and the date (ignoring time)
            is_booked = Order.query.filter(
                Order.tablereservation_id == table_id,
                Order.datetime >= start_of_day,
                Order.datetime < end_of_day
            ).first() is not None

            return {"table_id": table_id, "available": not is_booked}, 200

        except ValueError:
            return {"error": "Invalid datetime format. Use ISO format (YYYY-MM-DDTHH:MM)"}, 400
class TableReservationResource(Resource):
    def get(self, id=None):
        if id is None:
            table_name = request.args.get('table_name')
            if table_name:
                reservations = TableReservation.query.filter(TableReservation.table_name.ilike(f"%{table_name}%")).all()
                if not reservations:
                    return {"error": "Reservation not found"}, 404
                return [res.to_dict() for res in reservations], 200
            reservations = TableReservation.query.all()
            return [reservation.to_dict() for reservation in reservations], 200
        
        reservation = TableReservation.query.get(id)
        if not reservation:
            return {"error": "Reservation not found"}, 404
        return reservation.to_dict(), 200

    def post(self):
        data = request.get_json()
        table_name = data.get('table_name')
        
        if not table_name:
            return {"error": "Table name is required"}, 400

        new_reservation = TableReservation(table_name=table_name)
        db.session.add(new_reservation)
        db.session.commit()

        return new_reservation.to_dict(), 201

    def put(self, id):
        reservation = TableReservation.query.get(id)
        if not reservation:
            return {"error": "Reservation not found"}, 404
        
        data = request.get_json()
        reservation.table_name = data.get('table_name', reservation.table_name)
        
        db.session.commit()
        return reservation.to_dict(), 200

    def delete(self, id):
        reservation = TableReservation.query.get(id)
        if not reservation:
            return {"error": "Reservation not found"}, 404
        
        db.session.delete(reservation)
        db.session.commit()
        return {"message": "Reservation deleted successfully"}, 200

class TableAvailability(Resource):
    def get(self, table_id):  # Ensure table_id is included as a parameter
        datetime_str = request.args.get("datetime")

        if not datetime_str:
            return {"error": "Missing datetime parameter"}, 400

        try:
            # Parse the input datetime string
            input_datetime = datetime.fromisoformat(datetime_str)
            # Extract just the date part (ignoring the time)
            input_date = input_datetime.date()

            # Calculate the start and end of the day
            start_of_day = datetime(input_date.year, input_date.month, input_date.day, 0, 0, 0)
            end_of_day = start_of_day + timedelta(days=1)

            # Query the database for any orders matching the table_id and the date (ignoring time)
            is_booked = Order.query.filter(
                Order.tablereservation_id == table_id,
                Order.datetime >= start_of_day,
                Order.datetime < end_of_day
            ).first() is not None

            return {"table_id": table_id, "available": not is_booked}, 200

        except ValueError:
            return {"error": "Invalid datetime format. Use ISO format (YYYY-MM-DDTHH:MM)"}, 400
class PlaceOrder(Resource):
    def post(self):
        data = request.get_json()
        customer_id = data.get('customer_id')
        tablereservation_id = data.get('tablereservation_id')
        orders = data.get('orders', [])
        order_datetime = data.get('order_datetime')

        if not customer_id:
            return {"error": "Missing required customer_id"}, 400
        if not tablereservation_id:
            return {"error": "Missing required tablereservation_id"}, 400
        if not orders:
            return {"error": "Missing required orders"}, 400

        for order_data in orders:
            if 'outlet_id' not in order_data or not order_data['items']:
                return {"error": "Missing outlet_id or items in order data"}, 400
            for item in order_data['items']:
                if 'food_id' not in item :
                    return {"error": "Missing food_id in order"}, 400
                if 'quantity' not in item :
                    return {"error": "Missing quantity in order"}, 400
                if 'total_price' not in item:
                    return {"error": "Missing total_price in order"}, 400


        try:
            if not order_datetime:
                raise ValueError("Missing order datetime.")

            # Parse datetime string into a datetime object
            order_datetime_obj = datetime.strptime(order_datetime, '%Y-%m-%dT%H:%M:%S')

            new_order = Order(
                customer_id=customer_id,
                tablereservation_id=tablereservation_id,
                datetime=order_datetime_obj,
                total=calculate_total(orders),
                status='pending'
            )
            db.session.add(new_order)
            db.session.flush()

            for order_data in orders:
                for item in order_data['items']:
                    new_item = OrderItem(
                        order_id=new_order.id,
                        outlet_id=order_data['outlet_id'],
                        food_id=item['food_id'],
                        quantity=item['quantity'],
                        total_price=item['total_price'],
                        tablereservation_id=new_order.tablereservation_id
                    )
                    db.session.add(new_item)

            db.session.commit()

            order_items = OrderItem.query.filter_by(order_id=new_order.id).all()

            return {
                'message':"Order placed successfully!",
                'items': [
                    {"food_id": item.food_id, "quantity": item.quantity, "total_price": item.total_price}
                    for item in order_items
                ]
                }, 201

        except Exception as e:
            db.session.rollback()
            app.logger.error(f"Error placing order:v{str(e)}")
            return{"error":"Error placing order.", "details":str(e)}, 400        

class CustomerOrders(Resource):
    def get(self, customer_id):
        # Fetch the customer by ID
        customer = Customer.query.get(customer_id)
        
        # If the customer does not exist, return a 404 error
        if not customer:
            return {"error": "Customer not found"}, 404

        # Fetch all orders associated with the customer
        orders = Order.query.filter_by(customer_id=customer_id).all()

        # If no orders are found, return a message indicating so
        if not orders:
            return {"message": "No orders found for this customer"}, 404

        # Serialize the orders into a list of dictionaries
        orders_data = []
        for order in orders:
            order_data = {
                "id": order.id,
                "customer_id": order.customer_id,
                "tablereservation_id": order.tablereservation_id,
                "datetime": order.datetime.strftime('%Y-%m-%dT%H:%M:%S'),
                "total": order.total,
                "status": order.status
            }
            orders_data.append(order_data)

        # Return the orders data as JSON
        return jsonify(orders_data)

class AddToCart(Resource):
    def post(self):
        item = request.get_json()
        food_id = item.get('food_id')
        quantity = item.get('quantity')

        # Initialize cart if it doesn't exist
        if 'cart' not in session:
            session['cart'] = []

        # Check if the item already exists in the cart
        item_exists = False
        for cart_item in session['cart']:
            if cart_item['food_id'] == food_id:
                cart_item['quantity'] += quantity  # Update quantity
                item_exists = True
                break

        if not item_exists:
            session['cart'].append({'food_id': food_id, 'quantity': quantity})

        session.modified = True  # Mark session as modified

        # Set session variable for the toast notification
        session['toast_message'] = 'Item added to cart successfully!'

        return jsonify({'message': 'Item added to cart successfully!'})


class ViewCart(Resource):
    def get(self):
        # Return the cart stored in the session
        return jsonify(session.get('cart', []))


class CheckToast(Resource):
    def get(self):
        # Check if toast notification should be shown
        toast_message = session.get('toast_message', None)
        # Clear the session variable after showing the toast message
        session.pop('toast_message', None)
        return jsonify({'toast_message': toast_message})      


# Register resources with the API
api.add_resource(FoodsResource, "/foods")
api.add_resource(FoodByNameResource, "/foods/<string:name>")
api.add_resource(FoodByOutletResource, "/outlets/<int:outlet_id>/foods")
api.add_resource(FoodByPriceResource, "/foods/<int:price>")
api.add_resource(FoodByIDResource, "/api/food/id/<int:food_id>")
api.add_resource(OutletResource, '/outlets', '/outlets/<int:id>')
api.add_resource(OwnerResource, "/owners", "/owners/<int:id>")  
api.add_resource(CustomerResource, "/customers", "/customers/<int:id>")  
api.add_resource(CustomerOrders, '/customers/<int:customer_id>/orders')
api.add_resource(Login, "/login")
api.add_resource(Logout, "/logout")
api.add_resource(OrdersResource, "/orders", "/orders/<int:id>")
api.add_resource(OwnerOutletResource, "/owner/<int:owner_id>/outlets")
api.add_resource(TableReservationResource, "/reservations", "/reservations/<int:id>")
api.add_resource(TableAvailability, "/tables/<int:table_id>/availability")

api.add_resource(PlaceOrder, '/place-order')
api.add_resource(AddToCart, '/add-to-cart')
api.add_resource(ViewCart, '/view-cart')
api.add_resource(CheckToast, '/check-toast')


# api.add_resource(OutletResource, "/api/outlets", "/api/outlets/<int:id>")


if __name__ == '__main__':
    app.run(debug=True)

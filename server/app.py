from flask import Flask, request
from flask_migrate import Migrate
from flask_restful import Api, Resource,reqparse
from flask_cors import CORS
from models import db, Owner, Customer, Outlet, Food, Order, TableReservation
from flask_jwt_extended import JWTManager, create_access_token, jwt_required, get_jwt
from werkzeug.security import generate_password_hash, check_password_hash
from datetime import datetime, timedelta
from flask import session
import json

app = Flask(__name__)
app.config["SQLALCHEMY_DATABASE_URI"] = "postgresql://karimi:123456@localhost:5432/food_court_db"
app.config["SQLALCHEMY_TRACK_MODIFICATIONS"] = False
app.config["JWT_SECRET_KEY"] = "your_jwt_secret_key"  # Add a secure JWT secret key
app.config["SECRET_KEY"] = "your_secret_key"  # Add a secure secret key
api = Api(app)
# Initialize Extensions
db.init_app(app)
migrate = Migrate(app, db)
jwt = JWTManager(app)
api = Api(app)
CORS(app)

# Store revoked tokens(use a database in production)
blacklist = set()

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

        new_user = self.model(username=name_or_username, email=email) if hasattr(self.model, 'username') else self.model(name=name_or_username, email=email)
        new_user.set_password(password)
        db.session.add(new_user)
        db.session.commit()

        # store user data in session
        session['user_id'] = new_user.id  # Store the user ID in session
        session['logged_in'] = True

        access_token = create_access_token(identity={'email': new_user.email})
        session['access_token'] = access_token

        print("Session Data:", session)
        

        return {
            'message': f'{self.model.__name__} Signup successful',
            'access_token': access_token,
            'redirect_url': self.redirect_url
        }, 201

class CustomerSignup(BaseSignup):
    model = Customer
    redirect_url = "/customerdashboard"

class OwnerSignup(BaseSignup):
    model = Owner
    redirect_url = "/ownerdashboard"  # Redirect to Owner Dashboard


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
        print("Received data:", data)
        name = data.get('name')
        owner_id = data.get('owner_id')
        photo_url= data.get('photo_url')
        if not name or not owner_id:
            return {"error": "All fields are required"}, 400

        if Outlet.query.filter_by(name=name).first():
            return {"error": "Outlet with this name already exists"}, 409

        new_outlet = Outlet(name=name, owner_id=owner_id,photo_url=photo_url)
        db.session.add(new_outlet)
        db.session.commit()

        return new_outlet.to_dict(), 201

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
        outlet_id = data.get('outlet_id')

        if not name or not price or not waiting_time or not outlet_id:
            return {"error": "All fields are required"}, 400
        
        if Food.query.filter_by(name=name).first():
            return {"error": "Food already exists"}, 409
        
        new_food = Food(name=name, price=price, waiting_time=waiting_time, outlet_id=outlet_id)
        db.session.add(new_food)
        db.session.commit()

        return {"message": "Food created successfully"}, 200

class FoodByNameResource(Resource):
    def get(self, name):
        try:
            food = Food.query.filter_by(name=name).first()
            if food:
                return food.to_dict(), 200
            return {"message": "Food not found"}, 404
        except Exception as e:
            return {"message": str(e)}, 500
               
    def patch(self, name):
        food = Food.query.filter_by(name=name).first()
        if not food:
            return {'error': 'Food not found'}, 404

        data = request.get_json()
        if not data:
            return {'error': 'No update data provided'}, 400

        if 'name' in data:
            food.name = data['name']
        if 'price' in data:
            food.price = data['price']
        if 'waiting_time' in data:
            food.waiting_time = data['waiting_time']

        db.session.commit()

        return {'message': 'Food updated successfully', 'food': food.to_dict()}, 200
    
    def delete(self, name):
        food = Food.query.filter_by(name=name).first()
        if not food:
            return {'error': 'Food not found'}, 404

        db.session.delete(food)
        db.session.commit()
        return ({'message': 'Customer deleted successfully'}), 200
class FoodByOutletResource(Resource):
    def get(self, outlet_id):
        try:
            food_items = Food.query.filter_by(outlet_id=outlet_id).all()
            if food_items:
                return [food.to_dict() for food in food_items], 200
            return {"message": "No food found for this outlet"}, 404
        except Exception as e:
            return {"message": str(e)}, 500

# Resource to get food by price
class FoodByPriceResource(Resource):
    def get(self, price):
        try:
            food = Food.query.filter_by(price=price).first()
            if food:
                return food.to_dict(), 200
            return {"message": "Price not found"}, 404
        except Exception as e:
            return {"message": str(e)}, 500
        


class OrdersResource(Resource):
    def post(self):
        data = request.get_json()
        if 'status' in data:
            order.status = data['status']
            
            # If order is completed, ask client if they want to reserve a table
            if order.status == "completed" and 'reserve_table' in data and data['reserve_table']:
                return self.reserve_table(order.id)
        
        db.session.commit()
        return order.to_dict(), 200
    
    def delete(self, id):
        """Delete order."""
        order = Order.query.get(id)
        if not order:
            return {"error": "Order not found"}, 404
        
        db.session.delete(order)
        db.session.commit()
        return {"message": "Order has been deleted successfully"}, 200
    
    def reserve_table(self, order_id):
        """Handles table reservation."""
        available_tables = TableReservation.query.filter_by(is_reserved=False).all()
        if not available_tables:
            return {"error": "No available tables"}, 400
        
        # Assign the first available table
        table = available_tables[0]
        table.is_reserved = True
        table.order_id = order_id
        table.reserved_at = datetime.utcnow()
        db.session.commit()
        
        return {"message": f"TableReservation {table.id} has been successfully reserved. You may be there in 30 minutes."}, 200
    
    def release_expired_tables(self):
        """Releases tables if the client hasn't arrived within 30 minutes."""
        expiration_time = datetime.utcnow() - timedelta(minutes=30)
        expired_tables = TableReservation.query.filter(TableReservation.is_reserved == True, TableReservation.reserved_at < expiration_time).all()
        
        for table in expired_tables:
            table.is_reserved = False
            table.order_id = None
            table.reserved_at = None
        
        db.session.commit()
        return {"message": "Expired tables have been released."}, 200

# api.add_resource(OrdersResource, "/orders", "/orders/<int:id>")

#Resource to get all orders
class OrdersResource(Resource):
    def get(self, id =None):
        """Retrieve a single orders by ID or all orders if no ID is provided."""
        if id:
            order = Order.query.get(id)
            if not order:
                return {"error": "Order not found"}, 404
            return order.to_dict(), 200
        orders = Order.query.all()
        return [order.to_dict() for order in orders], 200

    def patch(self, id):
        order = Order.query.get(id)
        if not order:
            return {"error": "Order not found"}, 404

        data = request.get_json()
        if "status" in data:
            order.status = data["status"]
        db.session.commit()
        return order.to_dict(), 200

    def delete(self, id):
        order = Order.query.get(id)
        if not order:
            return {"error": "Order not found"}, 404
        db.session.delete(order)
        db.session.commit()
        return {"message": "Order deleted successfully"}, 200

        
#Resource to add food




# Registering the resources with Flask-RESTful
    api.add_resource(FoodsResource, "/foods")
api.add_resource(FoodByNameResource, "/foods/<string:name>")
api.add_resource(FoodByPriceResource, "/foods/<int:price>")  
api.add_resource(FoodByOutletResource, "/food/outlet_id/<int:outlet_id>")


# Add the resource to the API
api.add_resource(OutletResource, '/outlets', '/outlets/<int:id>')
api.add_resource(OwnerResource, "/owners", "/owners/<int:id>")  
api.add_resource(CustomerResource, "/customers", "/customers/<int:id>")  
api.add_resource(Login, "/login")
api.add_resource(Logout, "/logout")
api.add_resource(OrdersResource, "/orders", "/orders/<int:id>")

if __name__ == '__main__':
    app.run(debug=True)

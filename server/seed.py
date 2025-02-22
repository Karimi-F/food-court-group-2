from app import app, db
from models import Customer, Owner, Outlet, TableReservation, Food, Order
from datetime import datetime

# Initialize the app context
with app.app_context():
    # Drop and recreate the tables
    db.drop_all()
    db.create_all()

    # Create Owners
    owner1 = Owner(name="Alice Johnson", email="alice@example.com", password="securepass")
    owner2 = Owner(name="Bob Smith", email="bob@example.com", password="strongpass")
    
    db.session.add_all([owner1, owner2])
    db.session.commit()

    # Create Outlets with real images
    outlet1 = Outlet(
        name="Alice's Diner", 
        photo_url="https://images.unsplash.com/photo-1555396273-367ea4eb4db5", 
        owner_id=owner1.id
    )
    
    outlet2 = Outlet(
        name="Bob's Burgers", 
        photo_url="https://images.unsplash.com/photo-1565299507177-b0ac66763828", 
        owner_id=owner2.id
    )
    
    db.session.add_all([outlet1, outlet2])
    db.session.commit()

    # Create Customers
    customer1 = Customer(name="Charlie Davis", email="charlie@example.com", password="mypassword")
    customer2 = Customer(name="Dana White", email="dana@example.com", password="secure123")
    
    db.session.add_all([customer1, customer2])
    db.session.commit()

    # Create Table Reservations
    table1 = TableReservation(table_name="Table 1")
    table2 = TableReservation(table_name="Table 2")

    db.session.add_all([table1, table2])
    db.session.commit()

    # Create Food Items
    food1 = Food(name="Cheeseburger", price=8.99, waiting_time="10 mins", category="Burgers", outlet_id=outlet2.id)
    food2 = Food(name="Pasta Alfredo", price=12.99, waiting_time="15 mins", category="Pasta", outlet_id=outlet1.id)
    
    db.session.add_all([food1, food2])
    db.session.commit()

    # Create Orders
    order1 = Order(customer_id=customer1.id, tablereservation_id=table1.id, food_id=food1.id, quantity=2, status="Pending", datetime=datetime.utcnow())
    order2 = Order(customer_id=customer2.id, tablereservation_id=table2.id, food_id=food2.id, quantity=1, status="Completed", datetime=datetime.utcnow())

    db.session.add_all([order1, order2])
    db.session.commit()

    print("Database seeded successfully!")

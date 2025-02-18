from faker import Faker
from random import randint, choice
from app import app, db
from models import Customer, Owner, Outlet, TableReservation, Food, Order

fake = Faker()

# Function to seed data
def seed_data():
    # Drop all tables before seeding new data
    db.drop_all()
    db.create_all()  # Recreate tables based on updated models

    # Seed Owners
    owners = []
    for _ in range(3):  # Creating 3 owners
        owner = Owner(
            name=fake.name(),
            email=fake.email(),
            password=fake.password()
        )
        db.session.add(owner)
        owners.append(owner)
    
    db.session.commit()

    # Seed Outlets
    outlets = []
    for _ in range(5):  # Creating 5 outlets
        owner = choice(owners)  # Assigning each outlet to a random owner
        outlet = Outlet(
            name=fake.company(),
            owner_id=owner.id
        )
        db.session.add(outlet)
        outlets.append(outlet)
    
    db.session.commit()

    # Seed Customers
    customers = []
    for _ in range(10):  # Creating 10 customers
        customer = Customer(
            name=fake.name(),
            email=fake.email(),
            password=fake.password()
        )
        db.session.add(customer)
        customers.append(customer)
    
    db.session.commit()

    # Seed Table Reservations
    tables = []
    for _ in range(8):  # Creating 8 table reservations
        # outlet = choice(outlets)
        table = TableReservation(
            table_name=f"Table {_+1}",
            outlet_id=outlet.id,
            # waiter_id=randint(1, 10)  # Random waiter ID for now
        )
        db.session.add(table)
        tables.append(table)
    
    db.session.commit()

    # Seed Food Items
    foods = []
    for _ in range(15):  # Creating 15 food items
        outlet = choice(outlets)
        food = Food(
            name=fake.word(),
            price=round(fake.random_number(digits=2), 2),
            waiting_time=f"{randint(5, 30)} min",
            outlet_id=outlet.id
        )
        db.session.add(food)
        foods.append(food)
    
    db.session.commit()

    # Seed Orders
    for _ in range(20):  # Creating 20 orders
        customer = choice(customers)
        table = choice(tables)
        food = choice(foods)
        order = Order(
            customer_id=customer.id,
            tablereservation_id=table.id,
            food_id=food.id,
            quantity=randint(1, 5),
            status=choice(["Pending", "Completed", "Cancelled"])
        )
        db.session.add(order)
    
    db.session.commit()
    print("Database seeded successfully!")

# Run the seed function inside the app context
if __name__ == '__main__':
    with app.app_context():
        seed_data()

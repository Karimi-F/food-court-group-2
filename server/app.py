from flask import Flask
from flask_cors import CORS
from flask_sqlalchemy import SQLAlchemy
from flask_migrate import Migrate

# Import models AFTER initializing db
db = SQLAlchemy()
migrate = Migrate()

def create_app():
    app = Flask(__name__)
    app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///database.db'
    app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

    CORS(app)
    db.init_app(app)
    migrate.init_app(app, db)

    with app.app_context():  # ✅ Ensure database operations run inside the app context
        import models  # Import models AFTER initializing db
        db.create_all()  # ✅ This should only be here, inside app context

    return app

if __name__ == '__main__':
    app = create_app()
    app.run(debug=True)

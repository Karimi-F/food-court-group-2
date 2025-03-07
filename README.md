# Food Court Web Application

## Introduction
The Food Court Web Application is a full-stack project designed to digitize the ordering process in a mall-based food court. Customers can place orders via a mobile web application, reducing confusion caused by multiple waiters approaching with menus. The application also allows customers to book tables in advance and outlet owners to manage their menus and confirm orders.

## Problem Statement
The NextGen Mall food court in Nairobi has 20-30 food outlets serving a variety of cuisines. Customers often get overwhelmed by multiple waiters approaching them with menus. This project aims to solve this by implementing a digital ordering system where customers can order food via a mobile-friendly web application.

## Features
### Minimum Viable Product (MVP)
- A **mobile web application** accessible on iOS, Android, and desktops.
- A **dashboard for outlet owners** to manage their menus and orders.
- **Outlet registration system** for food vendors to sign up.
- A **REST API** to handle orders, menu management, and user authentication.
- **Order placement** with quantity selection.
- **Cart system** to review orders before finalizing.
- **Filtering options** by cuisine, price, and category.
- **Real-time order tracking**, where the outlet owner can confirm an order.
- **Table booking system** with availability display.

## Technologies Used
- **Frontend:** Next.js, TailwindCSS
- **Backend:** Flask (Python)
- **Database:** PostgreSQL
- **Authentication:** NextAuth.js / JWT
- **State Management:** React Context API
- **Deployment:** Vercel (Frontend), Render  (Backend)

## Folder Structure
```
📂 food-court-app/
 ┣ 📂 frontend/        # Next.js + TailwindCSS
 ┃ ┣ 📂 components/    # Reusable UI components
 ┃ ┣ 📂 pages/         # Next.js pages
 ┃ ┣ 📂 hooks/         # Custom React hooks
 ┃ ┣ 📂 styles/        # Global styles
 ┃ ┗ 📜 package.json   # Dependencies
 ┣ 📂 backend/         # Flask + PostgreSQL
 ┃ ┣ 📂 models/        # Database models
 ┃ ┣ 📂 routes/        # API routes
 ┃ ┣ 📂 services/      # Business logic
 ┃ ┣ 📂 tests/         # Unit tests
 ┃ ┗ 📜 requirements.txt # Backend dependencies
 ┣ 📂 database/        # SQL scripts
 ┗ 📜 README.md        # Documentation
```

## Setup Instructions
### Prerequisites
Ensure you have the following installed:
- **Node.js (v18+)**
- **Python (v3.9+)**
- **PostgreSQL**

### Installation
#### Frontend
```bash
cd frontend
npm install
npm run dev
```
#### Backend
```bash
cd backend
pip install -r requirements.txt
flask run
```

## API Endpoints
| Method | Endpoint                 | Description                  |
|--------|--------------------------|------------------------------|
| GET    | `/api/menu`              | Fetch all menu items        |
| POST   | `/api/place-order`       | Place a new order           |
| GET    | `/api/order/:id`         | Get order details           |
| PUT    | `/api/order/:id/status`  | Update order status         |
| POST   | `/api/auth/signup`       | User signup                 |
| POST   | `/api/auth/login`        | User login                  |

## Team and Collaboration
- The team consists of **4 developers**: 2 frontend (Next.js) and 2 backend (Flask, PostgreSQL).
- **Git Workflow:**
  - Feature branches for each new functionality.
  - All commits must be descriptive.
  - Each PR must be reviewed by **2 members + team lead** before merging.

## Future Enhancements
- **Multi-outlet ordering**
- **Live table occupancy tracking**
- **Payment integration (M-Pesa, PayPal, Stripe)**
- **AI-powered recommendations** based on customer preferences

## License
This project is licensed under the MIT License.



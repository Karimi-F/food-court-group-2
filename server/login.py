from fastapi import FastAPI, Depends, HTTPException, status
from sqlalchemy.orm import Session
from auth import hash_password, create_access_token, authenticate_user
from pydantic import BaseModel
from database import get_db, engine
from models import Base, User

app = FastAPI()

Base.metadata.create_all(bind=engine)

class UserCreate(BaseModel):
    email: str
    password: str
    is_admin: bool = False

class LoginRequest(BaseModel):
    email: str
    password: str

@app.post("/signup/")
def signup(user: UserCreate, db: Session = Depends(get_db)):
    if db.query(User).filter(User.email == user.email).first():
        raise HTTPException(status_code=400, detail="Email already registered")

    hashed_password = hash_password(user.password)
    db_user = User(email=user.email, password=hashed_password, is_admin=user.is_admin)
    db.add(db_user)
    db.commit()
    db.refresh(db_user)
    return {"message": "User created successfully"}

@app.post("/login/")
def login(request: LoginRequest, db: Session = Depends(get_db)):
    user = authenticate_user(db, request.email, request.password)
    if not user:
        raise HTTPException(status_code=400, detail="Invalid credentials")

    access_token = create_access_token({"sub": user.email, "is_admin": user.is_admin})

    if user.is_admin:
        return {
            "access_token": access_token,
            "message": "Login successful",
            "redirect_url": "/admin/dashboard"
        }
    else:
        return {
            "access_token": access_token,
            "message": "Login successful",
            "redirect_url": "/client/order-dashboard"
        }

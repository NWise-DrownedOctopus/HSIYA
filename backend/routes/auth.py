from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from ..models import User, ShopUser, Shop
from ..deps import get_db
from ..security import create_access_token, hash_password, get_current_user, verify_password
from pydantic import BaseModel
from datetime import datetime, timezone
from typing import Optional
import uuid

router = APIRouter(prefix="/auth", tags=["auth"])

class SignupRequest(BaseModel):
    email: str
    password: str

@router.post("/signup")
def signup(data: SignupRequest, db: Session = Depends(get_db)):
    # Check if email exists
    if db.query(User).filter(User.email == data.email).first():
        raise HTTPException(status_code=400, detail="Email already registered")

    # Ensure password is str
    raw_password = str(data.password)
    
    # Print for debugging: show password and length in bytes
    print("DEBUG: raw_password =", repr(raw_password))
    print("DEBUG: raw_password byte length =", len(raw_password.encode("utf-8")))

    # Truncate after encoding to bytes to satisfy bcrypt 72-byte limit
    raw_bytes = raw_password.encode("utf-8")[:72]
    safe_password = raw_bytes.decode("utf-8", errors="ignore")
    
    # Print again to see what will actually be hashed
    print("DEBUG: safe_password to hash =", repr(safe_password))
    print("DEBUG: safe_password byte length =", len(safe_password.encode("utf-8")))

    # Hash password
    password_hash = hash_password(safe_password)

    user = User(
        email=data.email,
        password_hash=password_hash,
        created_at=datetime.now(timezone.utc)
    )
    db.add(user)
    db.commit()
    db.refresh(user)

    return {"id": str(user.id), "email": user.email}


@router.post("/login")
def login(email: str, password: str, db: Session = Depends(get_db)):
    # 1️⃣ Find the user by email
    user = db.query(User).filter(User.email == email).first()
    if not user:
        raise HTTPException(status_code=401, detail="Invalid credentials")

    # 2️⃣ Verify password
    if not verify_password(password, user.password_hash):
        raise HTTPException(status_code=401, detail="Invalid credentials")

    # 3️⃣ Find ShopUser entry (if user belongs to multiple shops, pick the first)
    shop_user = db.query(ShopUser).filter(ShopUser.user_id == user.id).first()
    if not shop_user:
        raise HTTPException(status_code=400, detail="User not assigned to a shop")

    # 4️⃣ Generate JWT
    token = create_access_token({
        "sub": str(user.id),
        "shop_id": str(shop_user.shop_id),
        "role": shop_user.role
    })

    return {
        "access_token": token,
        "token_type": "bearer"
    }
    
@router.get("/me")
def read_me(current_user: User = Depends(get_current_user)):
    return {
        "email": current_user.email,
        "shop_id": current_user.shop_id,
        "role": current_user.role
    }
    
@router.post("/shops")
def create_shop(name: str, current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    # Create shop
    shop = Shop(
        name=name,
        created_at=datetime.now(timezone.utc)
    )
    db.add(shop)
    db.commit()
    db.refresh(shop)

    # Link user as admin
    shop_user = ShopUser(
        shop_id=shop.id,
        user_id=current_user.id,
        role="admin",
        created_at=datetime.now(timezone.utc)
    )
    db.add(shop_user)
    db.commit()
    db.refresh(shop_user)

    return {"shop_id": str(shop.id), "shop_name": shop.name, "role": shop_user.role}



"""
Auth router: register, login, get/update current user profile.
"""
from fastapi import APIRouter, HTTPException, Depends
from bson import ObjectId
from database import users_col
from models.models import UserCreate, UserLogin, UserOut, HealthProfile
from utils.auth import hash_password, verify_password, create_access_token, get_current_user

router = APIRouter(prefix="/auth", tags=["Auth"])


def serialize_user(u: dict) -> dict:
    u["id"] = str(u["_id"])
    return u


@router.post("/register", response_model=dict)
async def register(user: UserCreate):
    if await users_col.find_one({"email": user.email}):
        raise HTTPException(status_code=400, detail="Email already registered")

    doc = {
        "name": user.name,
        "email": user.email,
        "password": hash_password(user.password),
        "health_profile": user.health_profile.model_dump(),
        "is_admin": False,
    }
    result = await users_col.insert_one(doc)
    token = create_access_token({"user_id": str(result.inserted_id), "email": user.email, "is_admin": False})
    return {"access_token": token, "token_type": "bearer"}


@router.post("/login", response_model=dict)
async def login(creds: UserLogin):
    user = await users_col.find_one({"email": creds.email})
    if not user or not verify_password(creds.password, user["password"]):
        raise HTTPException(status_code=401, detail="Invalid credentials")

    token = create_access_token({
        "user_id": str(user["_id"]),
        "email": user["email"],
        "is_admin": user.get("is_admin", False),
    })
    return {"access_token": token, "token_type": "bearer"}


@router.get("/me", response_model=UserOut)
async def get_me(current: dict = Depends(get_current_user)):
    user = await users_col.find_one({"_id": ObjectId(current["user_id"])})
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    return UserOut(
        id=str(user["_id"]),
        name=user["name"],
        email=user["email"],
        health_profile=HealthProfile(**user.get("health_profile", {})),
        is_admin=user.get("is_admin", False),
    )


@router.put("/me/health-profile")
async def update_health_profile(profile: HealthProfile, current: dict = Depends(get_current_user)):
    await users_col.update_one(
        {"_id": ObjectId(current["user_id"])},
        {"$set": {"health_profile": profile.model_dump()}},
    )
    return {"message": "Health profile updated"}

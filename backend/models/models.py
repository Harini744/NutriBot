"""
Pydantic models (request/response schemas) for all collections.
"""
from pydantic import BaseModel, EmailStr, Field
from typing import List, Optional
from datetime import datetime


# ── Auth ──────────────────────────────────────────────────────────────────────

class HealthProfile(BaseModel):
    diet_type: Optional[str] = "none"          # vegan, keto, diabetic, etc.
    allergies: Optional[List[str]] = []
    calorie_goal: Optional[int] = 2000
    health_goal: Optional[str] = "maintain"    # weight_loss, high_protein, maintain


class UserCreate(BaseModel):
    name: str
    email: EmailStr
    password: str
    health_profile: Optional[HealthProfile] = HealthProfile()


class UserLogin(BaseModel):
    email: EmailStr
    password: str


class UserOut(BaseModel):
    id: str
    name: str
    email: str
    health_profile: HealthProfile
    is_admin: bool = False


# ── Food ──────────────────────────────────────────────────────────────────────

class Nutrition(BaseModel):
    calories: int = 0
    protein: float = 0.0
    carbs: float = 0.0
    fat: float = 0.0
    fiber: float = 0.0


class FoodItem(BaseModel):
    name: str
    description: str
    price: float
    category: str                              # e.g. "burger", "salad", "dessert"
    image_url: str = ""
    nutrition: Nutrition = Nutrition()
    tags: List[str] = []                       # e.g. ["vegan", "high-protein"]
    available: bool = True


class FoodItemOut(FoodItem):
    id: str


# ── Cart ──────────────────────────────────────────────────────────────────────

class CartItem(BaseModel):
    food_id: str
    quantity: int = 1


class CartUpdate(BaseModel):
    food_id: str
    quantity: int                              # 0 = remove


# ── Orders ────────────────────────────────────────────────────────────────────

class OrderItem(BaseModel):
    food_id: str
    food_name: str
    price: float
    quantity: int


class OrderCreate(BaseModel):
    items: List[OrderItem]
    address: str
    payment_method: str = "mock"              # mock payment
    total: float


class OrderOut(OrderCreate):
    id: str
    user_id: str
    status: str = "placed"
    created_at: datetime


# ── Chatbot ───────────────────────────────────────────────────────────────────

class ChatMessage(BaseModel):
    message: str

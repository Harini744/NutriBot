"""
AI Recommendation router.
Returns personalized food suggestions based on user health profile + order history.
"""
from fastapi import APIRouter, Depends
from bson import ObjectId
from typing import List
from database import food_col, orders_col, users_col
from utils.auth import get_current_user
from utils.ai import get_recommendations

router = APIRouter(prefix="/recommendations", tags=["Recommendations"])


@router.get("/", response_model=List[dict])
async def recommend(current: dict = Depends(get_current_user)):
    # Fetch user health profile
    user = await users_col.find_one({"_id": ObjectId(current["user_id"])})
    health_profile = user.get("health_profile", {}) if user else {}

    # Collect past ordered food IDs
    past_orders = await orders_col.find({"user_id": current["user_id"]}).to_list(50)
    past_food_ids = []
    for order in past_orders:
        for item in order.get("items", []):
            past_food_ids.append(item.get("food_id", ""))

    # Fetch all available foods
    all_foods = await food_col.find({"available": True}).to_list(200)

    # Score and return top recommendations
    recommended = get_recommendations(all_foods, health_profile, past_food_ids)

    # Serialize ObjectId
    result = []
    for f in recommended:
        f["id"] = str(f.pop("_id"))
        result.append(f)
    return result

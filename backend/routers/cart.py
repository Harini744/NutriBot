"""
Cart router: per-user cart stored in MongoDB.
"""
from fastapi import APIRouter, Depends, HTTPException
from bson import ObjectId
from database import cart_col, food_col
from models.models import CartItem, CartUpdate
from utils.auth import get_current_user

router = APIRouter(prefix="/cart", tags=["Cart"])


async def get_cart_doc(user_id: str) -> dict:
    cart = await cart_col.find_one({"user_id": user_id})
    if not cart:
        cart = {"user_id": user_id, "items": []}
        await cart_col.insert_one(cart)
    return cart


@router.get("/")
async def get_cart(current: dict = Depends(get_current_user)):
    cart = await get_cart_doc(current["user_id"])
    # Enrich with food details
    enriched = []
    for item in cart.get("items", []):
        food = await food_col.find_one({"_id": ObjectId(item["food_id"])})
        if food:
            enriched.append({
                "food_id": item["food_id"],
                "quantity": item["quantity"],
                "name": food["name"],
                "price": food["price"],
                "image_url": food.get("image_url", ""),
            })
    return {"items": enriched}


@router.post("/add")
async def add_to_cart(item: CartItem, current: dict = Depends(get_current_user)):
    cart = await get_cart_doc(current["user_id"])
    items = cart.get("items", [])

    # Update quantity if already in cart
    for i in items:
        if i["food_id"] == item.food_id:
            i["quantity"] += item.quantity
            await cart_col.update_one({"user_id": current["user_id"]}, {"$set": {"items": items}})
            return {"message": "Quantity updated"}

    items.append({"food_id": item.food_id, "quantity": item.quantity})
    await cart_col.update_one({"user_id": current["user_id"]}, {"$set": {"items": items}})
    return {"message": "Item added to cart"}


@router.put("/update")
async def update_cart(update: CartUpdate, current: dict = Depends(get_current_user)):
    cart = await get_cart_doc(current["user_id"])
    items = cart.get("items", [])

    if update.quantity == 0:
        items = [i for i in items if i["food_id"] != update.food_id]
    else:
        for i in items:
            if i["food_id"] == update.food_id:
                i["quantity"] = update.quantity
                break

    await cart_col.update_one({"user_id": current["user_id"]}, {"$set": {"items": items}})
    return {"message": "Cart updated"}


@router.delete("/clear")
async def clear_cart(current: dict = Depends(get_current_user)):
    await cart_col.update_one({"user_id": current["user_id"]}, {"$set": {"items": []}})
    return {"message": "Cart cleared"}

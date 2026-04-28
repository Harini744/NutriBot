"""
Orders router: place orders, view history, admin status update.
"""
from fastapi import APIRouter, Depends, HTTPException
from bson import ObjectId
from datetime import datetime
from typing import List
from database import orders_col, cart_col
from models.models import OrderCreate
from utils.auth import get_current_user, require_admin

router = APIRouter(prefix="/orders", tags=["Orders"])


def serialize(o: dict) -> dict:
    o["id"] = str(o.pop("_id"))
    return o


@router.post("/", response_model=dict)
async def place_order(order: OrderCreate, current: dict = Depends(get_current_user)):
    doc = {
        **order.model_dump(),
        "user_id": current["user_id"],
        "status": "placed",
        "created_at": datetime.utcnow(),
    }
    result = await orders_col.insert_one(doc)
    # Clear cart after order
    await cart_col.update_one({"user_id": current["user_id"]}, {"$set": {"items": []}})
    return {"id": str(result.inserted_id), "message": "Order placed successfully"}


@router.get("/my", response_model=List[dict])
async def my_orders(current: dict = Depends(get_current_user)):
    orders = await orders_col.find({"user_id": current["user_id"]}).sort("created_at", -1).to_list(50)
    return [serialize(o) for o in orders]


@router.get("/{order_id}", response_model=dict)
async def get_order(order_id: str, current: dict = Depends(get_current_user)):
    order = await orders_col.find_one({"_id": ObjectId(order_id), "user_id": current["user_id"]})
    if not order:
        raise HTTPException(status_code=404, detail="Order not found")
    return serialize(order)


# Admin: list all orders and update status
@router.get("/admin/all", response_model=List[dict])
async def all_orders(_: dict = Depends(require_admin)):
    orders = await orders_col.find().sort("created_at", -1).to_list(200)
    return [serialize(o) for o in orders]


@router.put("/admin/{order_id}/status")
async def update_status(order_id: str, status: str, _: dict = Depends(require_admin)):
    valid = ["placed", "preparing", "out_for_delivery", "delivered", "cancelled"]
    if status not in valid:
        raise HTTPException(status_code=400, detail=f"Status must be one of {valid}")
    await orders_col.update_one({"_id": ObjectId(order_id)}, {"$set": {"status": status}})
    return {"message": "Status updated"}

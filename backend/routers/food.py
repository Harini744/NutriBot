"""
Food router: CRUD for food items + search/filter.
Admin-only create/update/delete.
"""
from fastapi import APIRouter, HTTPException, Depends, Query
from fastapi.responses import JSONResponse
from bson import ObjectId
from typing import Optional
from database import food_col
from models.models import FoodItem
from utils.auth import require_admin
import json

router = APIRouter(prefix="/food", tags=["Food"])


def serialize(f: dict) -> dict:
    """Convert MongoDB doc to JSON-safe dict."""
    f["id"] = str(f.pop("_id"))
    return f


@router.get("/categories/list")
async def get_categories():
    """Return distinct food categories. Must be before /{food_id}."""
    cats = await food_col.distinct("category")
    return JSONResponse(content=cats)


@router.get("/")
async def list_foods(
    category: Optional[str] = Query(None),
    search: Optional[str] = Query(None),
    tag: Optional[str] = Query(None),
):
    query: dict = {"available": True}
    if category:
        query["category"] = category
    if tag:
        query["tags"] = tag
    if search:
        query["name"] = {"$regex": search, "$options": "i"}

    foods = await food_col.find(query).to_list(100)
    return JSONResponse(content=[serialize(f) for f in foods])


@router.get("/{food_id}")
async def get_food(food_id: str):
    try:
        oid = ObjectId(food_id)
    except Exception:
        raise HTTPException(status_code=400, detail="Invalid food ID")
    food = await food_col.find_one({"_id": oid})
    if not food:
        raise HTTPException(status_code=404, detail="Food not found")
    return JSONResponse(content=serialize(food))


@router.post("/")
async def create_food(food: FoodItem, _: dict = Depends(require_admin)):
    result = await food_col.insert_one(food.model_dump())
    return {"id": str(result.inserted_id), "message": "Food created"}


@router.put("/{food_id}")
async def update_food(food_id: str, food: FoodItem, _: dict = Depends(require_admin)):
    await food_col.update_one({"_id": ObjectId(food_id)}, {"$set": food.model_dump()})
    return {"message": "Food updated"}


@router.delete("/{food_id}")
async def delete_food(food_id: str, _: dict = Depends(require_admin)):
    await food_col.delete_one({"_id": ObjectId(food_id)})
    return {"message": "Food deleted"}

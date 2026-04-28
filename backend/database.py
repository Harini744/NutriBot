"""
MongoDB connection using Motor (async driver).
"""
import os
from motor.motor_asyncio import AsyncIOMotorClient
from dotenv import load_dotenv

load_dotenv()

MONGO_URL = os.getenv("MONGO_URL", "mongodb://localhost:27017")
DB_NAME = os.getenv("DB_NAME", "food_ordering")

client = AsyncIOMotorClient(MONGO_URL)
db = client[DB_NAME]

# Collections
users_col = db["users"]
food_col = db["food_items"]
orders_col = db["orders"]
cart_col = db["cart"]

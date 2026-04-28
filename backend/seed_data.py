"""
Seed script: populates MongoDB with sample food items.
Run once: python seed_data.py
"""
import asyncio
from motor.motor_asyncio import AsyncIOMotorClient
from dotenv import load_dotenv
import os

load_dotenv()

client = AsyncIOMotorClient(os.getenv("MONGO_URL", "mongodb://localhost:27017"))
db = client[os.getenv("DB_NAME", "food_ordering")]

FOODS = [
    {"name": "Grilled Chicken Salad", "description": "Fresh greens with grilled chicken breast, cherry tomatoes, and lemon dressing.", "price": 12.99, "category": "salad", "image_url": "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=400", "nutrition": {"calories": 320, "protein": 35, "carbs": 12, "fat": 10, "fiber": 4}, "tags": ["high-protein", "low-carb", "gluten-free"], "available": True},
    {"name": "Vegan Buddha Bowl", "description": "Quinoa, roasted chickpeas, avocado, cucumber, and tahini sauce.", "price": 13.49, "category": "bowl", "image_url": "https://images.unsplash.com/photo-1540189549336-e6e99c3679fe?w=400", "nutrition": {"calories": 410, "protein": 14, "carbs": 52, "fat": 16, "fiber": 9}, "tags": ["vegan", "gluten-free", "high-fiber"], "available": True},
    {"name": "Classic Beef Burger", "description": "Juicy beef patty with lettuce, tomato, cheese, and special sauce.", "price": 10.99, "category": "burger", "image_url": "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=400", "nutrition": {"calories": 650, "protein": 32, "carbs": 48, "fat": 34, "fiber": 2}, "tags": ["high-protein"], "available": True},
    {"name": "Keto Egg Bowl", "description": "Scrambled eggs, bacon, avocado, and spinach. Zero carb delight.", "price": 11.49, "category": "bowl", "image_url": "https://images.unsplash.com/photo-1525351484163-7529414344d8?w=400", "nutrition": {"calories": 480, "protein": 28, "carbs": 6, "fat": 38, "fiber": 3}, "tags": ["keto", "low-carb", "high-protein"], "available": True},
    {"name": "Margherita Pizza", "description": "Classic tomato sauce, fresh mozzarella, and basil on thin crust.", "price": 14.99, "category": "pizza", "image_url": "https://images.unsplash.com/photo-1574071318508-1cdbab80d002?w=400", "nutrition": {"calories": 720, "protein": 24, "carbs": 88, "fat": 26, "fiber": 3}, "tags": ["vegetarian"], "available": True},
    {"name": "Diabetic-Friendly Stir Fry", "description": "Mixed vegetables with tofu in a light soy-ginger sauce. Low sugar.", "price": 12.49, "category": "stir-fry", "image_url": "https://images.unsplash.com/photo-1512058564366-18510be2db19?w=400", "nutrition": {"calories": 290, "protein": 18, "carbs": 22, "fat": 10, "fiber": 6}, "tags": ["diabetic-friendly", "vegan", "low-carb"], "available": True},
    {"name": "Protein Smoothie Bowl", "description": "Blended banana, protein powder, topped with granola and berries.", "price": 9.99, "category": "breakfast", "image_url": "https://images.unsplash.com/photo-1490645935967-10de6ba17061?w=400", "nutrition": {"calories": 380, "protein": 30, "carbs": 45, "fat": 8, "fiber": 5}, "tags": ["high-protein", "vegetarian"], "available": True},
    {"name": "Spicy Ramen", "description": "Rich pork broth, ramen noodles, soft-boiled egg, and nori.", "price": 13.99, "category": "noodles", "image_url": "https://images.unsplash.com/photo-1569718212165-3a8278d5f624?w=400", "nutrition": {"calories": 580, "protein": 22, "carbs": 72, "fat": 18, "fiber": 2}, "tags": [], "available": True},
    {"name": "Avocado Toast", "description": "Sourdough toast with smashed avocado, poached egg, and chili flakes.", "price": 8.99, "category": "breakfast", "image_url": "https://dirtydishesmessykisses.com/wp-content/uploads/2024/11/avocado-toast-recipe-1730592523.jpeg", "nutrition": {"calories": 340, "protein": 14, "carbs": 32, "fat": 18, "fiber": 7}, "tags": ["vegetarian", "high-fiber"], "available": True},
    {"name": "Chocolate Lava Cake", "description": "Warm chocolate cake with a gooey molten center, served with vanilla ice cream.", "price": 7.49, "category": "dessert", "image_url": "https://images.unsplash.com/photo-1606313564200-e75d5e30476c?w=400", "nutrition": {"calories": 520, "protein": 6, "carbs": 68, "fat": 24, "fiber": 1}, "tags": ["vegetarian"], "available": True},
    {"name": "Grilled Salmon", "description": "Atlantic salmon fillet with lemon butter, asparagus, and wild rice.", "price": 18.99, "category": "seafood", "image_url": "https://images.unsplash.com/photo-1467003909585-2f8a72700288?w=400", "nutrition": {"calories": 490, "protein": 42, "carbs": 28, "fat": 20, "fiber": 3}, "tags": ["high-protein", "gluten-free", "keto"], "available": True},
    {"name": "Caesar Salad", "description": "Romaine lettuce, parmesan, croutons, and classic Caesar dressing.", "price": 10.49, "category": "salad", "image_url": "https://images.unsplash.com/photo-1546793665-c74683f339c1?w=400", "nutrition": {"calories": 360, "protein": 12, "carbs": 24, "fat": 22, "fiber": 3}, "tags": ["vegetarian"], "available": True},
]


async def seed():
    col = db["food_items"]
    existing = await col.count_documents({})
    if existing > 0:
        print(f"Database already has {existing} food items. Skipping seed.")
        return
    await col.insert_many(FOODS)
    print(f"Seeded {len(FOODS)} food items successfully.")


if __name__ == "__main__":
    asyncio.run(seed())

"""
NutriBot - Smart rule-based chatbot with rich responses.
Works instantly with no API keys or model downloads.
"""
from fastapi import APIRouter
from models.models import ChatMessage
import random

router = APIRouter(prefix="/chatbot", tags=["Chatbot"])

# Rich response database
RESPONSES = {
    "greet": [
        "Hey! I'm NutriBot 🤖 Your personal nutrition assistant. Ask me about meals, calories, diet tips, or healthy choices!",
        "Hi there! Ready to help you eat smarter today 🥗 What can I help you with?",
    ],
    "calories": [
        "Calories are energy units in food. For weight loss, aim for a 300-500 kcal daily deficit. Our low-calorie picks: Grilled Chicken Salad (320 kcal), Diabetic-Friendly Stir Fry (290 kcal), and Avocado Toast (340 kcal) 🔥",
        "Daily calorie needs vary: women ~1800-2200 kcal, men ~2200-2800 kcal. Check your Dashboard to track today's intake! Our lightest meal is the Stir Fry at just 290 kcal 🥦",
    ],
    "protein": [
        "High-protein picks on our menu 💪\n• Grilled Chicken Salad – 35g protein\n• Grilled Salmon – 42g protein\n• Keto Egg Bowl – 28g protein\n• Protein Smoothie Bowl – 30g protein\nAim for 0.8-1g protein per kg of body weight daily!",
        "Protein builds muscle and keeps you full longer! Top choices: Grilled Salmon (42g), Grilled Chicken Salad (35g), Protein Smoothie Bowl (30g) 💪 Add any to your cart!",
    ],
    "vegan": [
        "Our vegan options 🌱\n• Vegan Buddha Bowl – quinoa, chickpeas, avocado (410 kcal)\n• Diabetic-Friendly Stir Fry – tofu & veggies (290 kcal)\n• Avocado Toast – smashed avo on sourdough (340 kcal)\nAll tagged 'vegan' on the menu!",
        "Going plant-based? Great choice! 🌿 Try our Vegan Buddha Bowl – it's packed with protein from chickpeas and quinoa. Only 410 kcal and super filling!",
    ],
    "keto": [
        "Keto-friendly options on our menu 🥑\n• Keto Egg Bowl – only 6g carbs!\n• Grilled Chicken Salad – 12g carbs\n• Grilled Salmon – 28g carbs\nKeto means high fat, moderate protein, very low carbs (under 50g/day).",
        "For keto, check out our Keto Egg Bowl 🍳 – bacon, eggs, avocado, spinach with just 6g carbs. Perfect for staying in ketosis!",
    ],
    "diabetic": [
        "Diabetic-friendly choices 🩺\n• Diabetic-Friendly Stir Fry – 22g carbs, high fiber\n• Grilled Chicken Salad – 12g carbs\n• Keto Egg Bowl – 6g carbs\nFocus on low-GI foods, high fiber, and avoid sugary sauces!",
        "Managing blood sugar? Our Diabetic-Friendly Stir Fry is perfect – low carb, high fiber tofu dish. Always check the nutrition info on each food page 🥦",
    ],
    "weight_loss": [
        "For weight loss, I recommend 🎯\n• Grilled Chicken Salad (320 kcal, 35g protein)\n• Diabetic-Friendly Stir Fry (290 kcal)\n• Avocado Toast (340 kcal, 7g fiber)\nHigh protein + high fiber = stay full longer, eat less overall!",
        "Weight loss tip: aim for meals under 500 kcal with at least 20g protein. Our top picks: Chicken Salad, Stir Fry, and Avocado Toast. Set your calorie goal in your Dashboard! 📊",
    ],
    "recommend": [
        "Based on popular choices, I'd suggest 🌟\n• Grilled Salmon – best overall nutrition\n• Vegan Buddha Bowl – most balanced\n• Grilled Chicken Salad – highest protein\nFor personalized picks, check the ✨ Recommendations section on the Home page!",
        "My top meal recommendations today 🍽️\n1. Grilled Salmon – omega-3 rich, 42g protein\n2. Vegan Buddha Bowl – fiber-packed, plant-based\n3. Keto Egg Bowl – perfect for low-carb diets\nAll available to add to your cart right now!",
    ],
    "fiber": [
        "High-fiber foods keep you full and support digestion 🥦\n• Vegan Buddha Bowl – 9g fiber\n• Avocado Toast – 7g fiber\n• Diabetic-Friendly Stir Fry – 6g fiber\nAim for 25-35g fiber daily!",
    ],
    "healthy": [
        "Healthiest options on our menu 💚\n• Grilled Salmon – omega-3, high protein, gluten-free\n• Grilled Chicken Salad – lean protein, low carb\n• Vegan Buddha Bowl – plant-based, high fiber\nAll have full nutrition info on their food pages!",
        "Eating healthy doesn't mean boring! Try our Grilled Salmon with asparagus and wild rice – delicious and packed with nutrients 🐟",
    ],
    "allergy": [
        "All food items show allergen tags on their detail pages 🏷️ Common tags: gluten-free, dairy-free, nut-free. You can also set your allergies in your Profile → Health Profile so we filter recommendations for you!",
        "Set your allergies in your Dashboard → Health Profile and our AI recommendation engine will automatically exclude those foods from your suggestions 🛡️",
    ],
    "order": [
        "Ordering is easy! 🛒\n1. Browse the menu on Home page\n2. Click any food → Add to Cart\n3. Go to Cart → Proceed to Checkout\n4. Enter address + payment → Place Order\nTrack your orders in the Dashboard!",
    ],
    "cart": [
        "To manage your cart 🛒 go to the Cart page (top right icon). You can increase/decrease quantities or remove items. When ready, click 'Proceed to Checkout'!",
    ],
    "price": [
        "Our menu ranges from $7.49 (Chocolate Lava Cake) to $18.99 (Grilled Salmon) 💰 Most meals are between $10-$15. Check the Home page for all prices!",
    ],
    "breakfast": [
        "Breakfast options 🌅\n• Avocado Toast – $8.99 (340 kcal)\n• Protein Smoothie Bowl – $9.99 (380 kcal)\n• Keto Egg Bowl – $11.49 (480 kcal)\nAll available on the menu!",
    ],
    "default": [
        "Great question! I'm best at helping with nutrition info, meal suggestions, diet advice, and app navigation. Try asking about calories, protein, vegan options, or weight loss tips! 🤖",
        "I'm NutriBot – I can help with meal recommendations, nutrition facts, diet tips (keto, vegan, diabetic-friendly), and ordering help. What would you like to know? 🥗",
        "Hmm, let me think... I'm most helpful with food and nutrition topics! Ask me about specific meals, calorie counts, protein content, or diet recommendations 💡",
    ],
}

KEYWORD_MAP = {
    "greet": ["hello", "hi", "hey", "good morning", "good evening", "howdy", "sup"],
    "calories": ["calorie", "calories", "kcal", "energy", "how many calories"],
    "protein": ["protein", "muscle", "gains", "high protein"],
    "vegan": ["vegan", "plant", "plant-based", "vegetarian", "no meat"],
    "keto": ["keto", "ketogenic", "low carb", "low-carb", "no carbs"],
    "diabetic": ["diabetic", "diabetes", "blood sugar", "sugar", "insulin"],
    "weight_loss": ["weight loss", "lose weight", "diet", "slim", "fat loss", "cutting"],
    "recommend": ["recommend", "suggest", "what should i", "best meal", "what to eat", "popular"],
    "fiber": ["fiber", "fibre", "digestion", "gut"],
    "healthy": ["healthy", "nutritious", "clean eating", "wholesome"],
    "allergy": ["allerg", "intolerance", "gluten", "dairy", "nuts", "nut-free"],
    "order": ["how to order", "place order", "ordering", "checkout", "how do i order"],
    "cart": ["cart", "basket", "add to cart", "remove from cart"],
    "price": ["price", "cost", "how much", "expensive", "cheap", "affordable"],
    "breakfast": ["breakfast", "morning meal", "brunch"],
}


def get_response(message: str) -> str:
    msg = message.lower().strip()
    for category, keywords in KEYWORD_MAP.items():
        if any(kw in msg for kw in keywords):
            return random.choice(RESPONSES[category])
    return random.choice(RESPONSES["default"])


@router.post("/", response_model=dict)
async def chat(msg: ChatMessage):
    return {"response": get_response(msg.message)}

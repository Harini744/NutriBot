"""
AI utilities:
  - Rule-based food recommendation engine
  - Simple keyword chatbot for nutrition/meal suggestions
"""
from typing import List, Dict, Any


# ── Recommendation Engine ─────────────────────────────────────────────────────

def score_food(food: Dict, health_profile: Dict, past_food_ids: List[str]) -> float:
    """
    Score a food item for a user based on:
      - health goal alignment
      - diet type match
      - allergy exclusion
      - past order boost
    Returns a float score (higher = better recommendation).
    """
    score = 0.0
    tags: List[str] = food.get("tags", [])
    nutrition: Dict = food.get("nutrition", {})
    goal = health_profile.get("health_goal", "maintain")
    diet = health_profile.get("diet_type", "none")
    allergies = [a.lower() for a in health_profile.get("allergies", [])]
    calorie_goal = health_profile.get("calorie_goal", 2000)

    # Hard exclude if food contains an allergen tag
    for allergen in allergies:
        if allergen in [t.lower() for t in tags]:
            return -1.0

    # Health goal scoring
    if goal == "weight_loss":
        cal = nutrition.get("calories", 500)
        if cal < 400:
            score += 3
        elif cal < 600:
            score += 1
    elif goal == "high_protein":
        protein = nutrition.get("protein", 0)
        if protein >= 25:
            score += 3
        elif protein >= 15:
            score += 1
    elif goal == "diabetic_friendly":
        carbs = nutrition.get("carbs", 50)
        if carbs < 20:
            score += 3
        elif carbs < 35:
            score += 1

    # Diet type match
    if diet != "none" and diet.lower() in [t.lower() for t in tags]:
        score += 2

    # Boost previously ordered items (familiarity)
    if food.get("_id") and str(food["_id"]) in past_food_ids:
        score += 1

    # Calorie proximity bonus
    cal = nutrition.get("calories", 500)
    per_meal_goal = calorie_goal / 3
    diff = abs(cal - per_meal_goal)
    if diff < 100:
        score += 1

    return score


def get_recommendations(
    all_foods: List[Dict],
    health_profile: Dict,
    past_food_ids: List[str],
    top_n: int = 6,
) -> List[Dict]:
    """Return top_n recommended food items sorted by score."""
    scored = []
    for food in all_foods:
        s = score_food(food, health_profile, past_food_ids)
        if s >= 0:
            scored.append((s, food))
    scored.sort(key=lambda x: x[0], reverse=True)
    return [f for _, f in scored[:top_n]]


# ── Chatbot ───────────────────────────────────────────────────────────────────

CHATBOT_RULES = [
    (["hello", "hi", "hey"], "Hey there! I'm NutriBot. Ask me about meals, nutrition, or healthy choices."),
    (["calorie", "calories"], "Calories measure energy in food. For weight loss aim for a 300-500 kcal daily deficit. Want me to suggest low-calorie meals?"),
    (["protein"], "Protein helps build muscle and keeps you full. Great sources: grilled chicken, eggs, lentils, and tofu. Want high-protein meal suggestions?"),
    (["vegan", "plant"], "Our vegan options are tagged 'vegan'. They're rich in fiber and antioxidants. Try our Vegan Buddha Bowl!"),
    (["keto", "low carb"], "Keto meals are high fat, low carb. Look for items tagged 'keto'. Avoid sugary sauces and bread."),
    (["diabetic", "diabetes", "sugar"], "For diabetic-friendly meals, choose low-carb, high-fiber options. Avoid fried foods and sugary drinks."),
    (["weight loss", "lose weight", "diet"], "For weight loss, focus on meals under 500 kcal with high protein and fiber. I can recommend some!"),
    (["recommend", "suggest", "what should"], "Based on your health profile, I'd suggest checking the Recommendations section on the home page — it's personalized just for you!"),
    (["allerg"], "Always check the tags on each food item for allergen info. You can also set your allergies in your profile."),
    (["order", "cart"], "You can add items to your cart from any food page, then head to the Cart to checkout."),
    (["help"], "I can help with: meal suggestions, nutrition info, diet tips, and navigating the app. What do you need?"),
]


def chatbot_response(message: str) -> str:
    """Simple keyword-matching chatbot. Returns a relevant response string."""
    msg = message.lower()
    for keywords, response in CHATBOT_RULES:
        if any(kw in msg for kw in keywords):
            return response
    return (
        "I'm not sure about that one. Try asking about calories, protein, "
        "vegan options, keto, weight loss, or meal recommendations!"
    )

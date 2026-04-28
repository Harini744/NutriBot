"""
FastAPI entry point.
Registers all routers and configures CORS for the React frontend.
"""
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from routers import auth, food, cart, orders, recommendations, chatbot

app = FastAPI(title="AI Food Ordering API", version="1.0.0")

# Allow React dev server
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # allows Vercel + ngrok
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Register routers
app.include_router(auth.router)
app.include_router(food.router)
app.include_router(cart.router)
app.include_router(orders.router)
app.include_router(recommendations.router)
app.include_router(chatbot.router)


@app.get("/")
async def root():
    return {"message": "AI Food Ordering API is running"}

"""
Chatbot router.
- Local dev: uses Ollama (tinyllama) if GROQ_API_KEY is not set
- Production: uses Groq API (set GROQ_API_KEY in environment)
Get free Groq key at https://console.groq.com
"""
import os
from fastapi import APIRouter, HTTPException
from models.models import ChatMessage
from dotenv import load_dotenv

load_dotenv()

GROQ_API_KEY = os.getenv("GROQ_API_KEY")

SYSTEM_PROMPT = (
    "You are NutriBot, a helpful AI assistant for NutriEats food ordering app. "
    "Help users with meal suggestions, nutrition info, diet advice (vegan, keto, diabetic-friendly, "
    "weight loss, high protein), and healthy eating tips. "
    "Keep responses short, friendly, and under 80 words."
)

router = APIRouter(prefix="/chatbot", tags=["Chatbot"])


@router.post("/", response_model=dict)
async def chat(msg: ChatMessage):
    # Production: use Groq
    if GROQ_API_KEY:
        try:
            from groq import Groq
            client = Groq(api_key=GROQ_API_KEY)
            response = client.chat.completions.create(
                model="llama3-8b-8192",
                messages=[
                    {"role": "system", "content": SYSTEM_PROMPT},
                    {"role": "user", "content": msg.message},
                ],
                max_tokens=200,
                temperature=0.7,
            )
            return {"response": response.choices[0].message.content.strip()}
        except Exception as e:
            raise HTTPException(status_code=500, detail=str(e))

    # Local dev: use Ollama
    try:
        import ollama
        response = ollama.chat(
            model="tinyllama",
            messages=[
                {"role": "system", "content": SYSTEM_PROMPT},
                {"role": "user", "content": msg.message},
            ],
        )
        return {"response": response["message"]["content"].strip()}
    except Exception as e:
        error = str(e).lower()
        if "connection" in error or "refused" in error:
            raise HTTPException(status_code=503, detail="Ollama is not running. Run: ollama serve")
        raise HTTPException(status_code=500, detail=str(e))

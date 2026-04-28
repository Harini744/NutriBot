#!/bin/bash
# Start Ollama in background
ollama serve &

# Wait for Ollama to be ready
echo "Waiting for Ollama to start..."
sleep 5

# Pull tinyllama if not already present
ollama pull tinyllama

# Start FastAPI
uvicorn main:app --host 0.0.0.0 --port 8000

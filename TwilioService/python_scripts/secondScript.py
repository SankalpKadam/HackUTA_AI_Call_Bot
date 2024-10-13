import asyncio
import websockets
import openai
from fastapi import FastAPI, WebSocket
import os
from pydantic import BaseModel
from typing import List

openai.api_key = os.getenv("OPENAI_API_KEY")

app = FastAPI()

class Message(BaseModel):
    content: str
    role: str

# Endpoint to handle OpenAI interaction
@app.websocket("/process-openai")
async def process_openai(websocket: WebSocket):
    await websocket.accept()

    while True:
        try:
            # Receive data from the WebSocket connection
            data = await websocket.receive_text()
            print(f"Received data: {data}")
            
            # Send the data to OpenAI API and get the response
            response = await call_openai(data)

            # Send response back to Node.js server via WebSocket
            await websocket.send_text(response)
        
        except Exception as e:
            print(f"Error: {e}")
            await websocket.close()
            break

# Function to call OpenAI
async def call_openai(prompt: str) -> str:
    response = openai.Completion.create(
        model="gpt-3.5-turbo",
        prompt=prompt,
        max_tokens=150
    )
    return response.choices[0].text.strip()

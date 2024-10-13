import asyncio
import websockets
import openai
from fastapi import FastAPI, WebSocket
import os
from pydantic import BaseModel
from typing import List
from openai import AzureOpenAI
import base64
import audioop
import vosk
import json

openai.api_key = os.getenv("OPENAI_API_KEY")

app = FastAPI()
model = vosk.Model('model')
class Message(BaseModel):
    content: str
    role: str

# Endpoint to handle OpenAI interaction
@app.websocket("/process-openai")
async def process_openai(websocket: WebSocket):
    rec = vosk.KaldiRecognizer(model, 16000)
    await websocket.accept()

    while True:
        try:
            # Receive data from the WebSocket connection
            data = await websocket.receive_text()
            # data = await base64.b64decode(data)
            # data = await audioop.ulaw2lin(data, 2)
            # data = audioop.ratecv(data, 2,1, 8000, 16000, None)[0]
            # if rec.AcceptWaveform(data):
            #     r = json.loads(rec.Result())
            #     print("Finally", r)
            # else:
            #     r = json.loads(rec.PartialResult())
            #     print('par',r)
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
    print(prompt, " Here")
    client = AzureOpenAI(
        api_key="f3e58d461386493b80a01da24c64e018",
        # https://learn.microsoft.com/en-us/azure/ai-services/openai/reference#rest-api-versioning
        api_version="2023-07-01-preview",
        #api_version="2024-08-06",
        # https://learn.microsoft.com/en-us/azure/cognitive-services/openai/how-to/create-resource?pivots=web-portal#create-a-resource
        azure_endpoint="https://llmcopyrightv2.openai.azure.com/",
    )
  
    def prompt_test(prompt):
        PROMPT_MESSAGES = [
        {
            "role": "user",
            "content": [
            {
                "type": "text",
                "text": prompt
            }
            ]
        }
        ]
        params = {
            "model": "V1",
            "messages": PROMPT_MESSAGES,
            "max_tokens": 200,
            "seed": 33,
            "temperature": 0,
            }
        result = client.chat.completions.create(**params)
        return result.choices[0].message.content
    res = prompt_test(f'{prompt}')
    print(res)
    return res

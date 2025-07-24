
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List
from google import genai
import os
from dotenv import load_dotenv
#
# Load environment variables from .env file
load_dotenv()
api_key=os.getenv("GEMINI_API_KEY")

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_methods=["*"],
    allow_headers=["*"]
)

class Product(BaseModel):
    id: int
    title: str
    price: str
    brand: str
    image: str

class QueryRequest(BaseModel):
    question: str
    visible_products: List[Product]

@app.post("/ask")
async def ask_question(request: QueryRequest):
    prompt = f"""
    Here is a list of visible products on a webpage:

    {[f"{p.title} by {p.brand}, priced at {p.price}" for p in request.visible_products]}

    The user asked: "{request.question}"

    Please answer based only on these products and their layout position if applicable.
    """
    client = genai.Client(api_key=api_key)

    response = client.models.generate_content(
        model="gemini-2.5-flash", contents=prompt
    )

    return {"answer": response.text}


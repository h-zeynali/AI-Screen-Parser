
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

class BoundingBox(BaseModel):
    top: float
    left: float
    width: float
    height: float

class Product(BaseModel):
    id: int
    title: str
    price: str
    brand: str
    image: str
    positionLabel: str
    boundingBox: BoundingBox

class QueryRequest(BaseModel):
    question: str
    visible_products: List[Product]

@app.post("/ask")
async def ask_question(request: QueryRequest):

    products = request.visible_products
    num_visible_products = len(products)

    if num_visible_products == 0:
        return {
            "answer": "There are no visible products on the screen to answer your question."
        }

    product_descriptions = "\\n".join([
        f"- {p.title} by {p.brand}, priced at {p.price}, located in the {p.positionLabel} (bounding box: top={p.boundingBox.top:.0f}, left={p.boundingBox.left:.0f}, width={p.boundingBox.width:.0f}, height={p.boundingBox.height:.0f})"
        for p in products
    ])

    prompt = f"""
    You are an assistant that answers questions about store products currently visible on a webpage.
    Each product has general details and spatial position (where it appears on the screen).

    Visible products:
    {product_descriptions}

    User question: "{request.question}"

    Answer in a clear, friendly tone, human read friendly and only based on the visible products and their layout.
    Use tab, new line , italic and bold for important item like price , product name and etc in which distiguishable from sentence.
    dont use start sighn (*) in answer use spave instead.
    """

    client = genai.Client(api_key=api_key)

    response = client.models.generate_content(
        model="gemini-2.5-flash", contents=prompt
    )

    try:
        client = genai.Client(api_key=api_key)
        response = client.models.generate_content(
            model="gemini-2.5-flash", contents=prompt
        )
        return {"answer": response.text}#.strip()}
    except Exception as e:
        return {
            "answer": f"Sorry, something went wrong while processing your request. (Error: {str(e)})"
        }




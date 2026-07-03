import json

from google import genai
from app.core.config import settings

client = genai.Client(
    api_key=settings.GEMINI_API_KEY
)


def extract_filters(query: str):

    prompt = f"""
You are an AI assistant for a food ordering application.

Your job is to understand the customer's request and extract search filters.

Return ONLY valid JSON.

Categories supported:
- Pizza
- Burger
- Chinese
- North Indian
- South Indian
- Italian
- Fast Food
- Momos
- Sandwich
- Rolls
- Biryani
- Thali
- Snacks
- Desserts
- Ice Cream
- Beverages
- Coffee
- Tea
- Juice
- Shakes

Return JSON in this exact format:

{{
    "vegetarian": null,
    "spicy": null,
    "fried": null,
    "healthy": null,
    "max_price": null,
    "min_price": null,
    "category": null
}}

Rules:

- If user asks vegetarian → vegetarian=true
- If user asks non vegetarian → vegetarian=false
- If user asks spicy → spicy=true
- If user asks not spicy or mild → spicy=false
- If user asks fried → fried=true
- If user asks not fried → fried=false
- If user asks healthy/light → healthy=true
- If user gives a budget like under 200, below 300 or less than 150, set max_price.
- If user gives a minimum price like above 100 or greater than 150, set min_price.

Map foods to categories:

Pizza → Pizza
Burger → Burger
Momos → Momos
Noodles, Fried Rice, Manchurian → Chinese
Dosa, Idli, Uttapam, Vada, Upma → South Indian
Paneer, Dal, Roti, Naan, Curry → North Indian
Pasta, Garlic Bread → Italian
Sandwich → Sandwich
Roll → Rolls
Biryani → Biryani
Thali → Thali
Cake, Brownie, Gulab Jamun → Desserts
Ice Cream → Ice Cream
Coffee → Coffee
Tea → Tea
Juice → Juice
Milkshake → Shakes
Cold Drink → Beverages

Examples:

User:
Something spicy and vegetarian under 200

Output:
{{
    "vegetarian": true,
    "spicy": true,
    "fried": null,
    "healthy": null,
    "max_price": 200,
    "min_price": null,
    "category": null
}}

User:
I want South Indian food

Output:
{{
    "vegetarian": null,
    "spicy": null,
    "fried": null,
    "healthy": null,
    "max_price": null,
    "min_price": null,
    "category": "South Indian"
}}

User:
Healthy burger under 300

Output:
{{
    "vegetarian": null,
    "spicy": null,
    "fried": false,
    "healthy": true,
    "max_price": 300,
    "min_price": null,
    "category": "Burger"
}}

User:
{query}
"""

    response = client.models.generate_content(
        model="gemini-2.5-flash",
        contents=prompt,
    )

    text = response.text.strip()

    if text.startswith("```json"):
        text = text.replace("```json", "").replace("```", "").strip()

    return json.loads(text)
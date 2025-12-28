from fastapi import FastAPI, HTTPException
from .models import ProductResponse
from .engine import aggregate_prices

app = FastAPI()

@app.get("/")
def read_root():
    return {"status": "Sloop Backend Online"}

@app.get("/search", response_model=ProductResponse)
async def search_product(q: str):
    """
    Input: "Nike Dunk"
    Output: JSON with prices from 4 vendors
    """
    print(f"🕷️ Slooping the web for: {q}")
    
    variants = await aggregate_prices(q)
    
    # Logic: Default to the most expensive one (so 'Optimize' feels good) or the 'Featured' one
    sorted_variants = sorted(variants, key=lambda x: x.price, reverse=True)
    selected = sorted_variants[0]
    
    return ProductResponse(
        id=f"sku_{q.replace(' ', '_')}_{random.randint(100,999)}",
        name=q.title(),
        image="https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=500", # Placeholder for now
        selected_option=selected,
        alternatives=variants
    )

# Run with: uvicorn main:app --reload --host 0.0.0.0
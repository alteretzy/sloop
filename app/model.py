from pydantic import BaseModel
from typing import List, Optional

class ProductVariant(BaseModel):
    vendor: str
    price: float
    url: str
    in_stock: bool
    shipping_time: str

class ProductResponse(BaseModel):
    id: str
    name: str
    image: str
    # Note: We don't send quantity here, that's client-side state
    selected_option: ProductVariant
    alternatives: List[ProductVariant]
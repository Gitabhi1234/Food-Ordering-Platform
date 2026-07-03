from pydantic import BaseModel
from typing import List


class CartAddRequest(BaseModel):
    menu_item_id: int
    quantity: int = 1


class CartItemResponse(BaseModel):
    id: int
    menu_item_id: int
    name: str
    image: str | None = None
    price: float
    quantity: int
    admin_id: int

    class Config:
        from_attributes = True


class CartResponse(BaseModel):
    cartItems: List[CartItemResponse]
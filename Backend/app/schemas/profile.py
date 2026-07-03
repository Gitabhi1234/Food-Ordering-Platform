from datetime import datetime
from pydantic import BaseModel, EmailStr, ConfigDict


class OrderItemResponse(BaseModel):
    id: int
    name: str
    quantity: int
    price: float
    image: str | None = None

    model_config = ConfigDict(from_attributes=True)


class OrderResponse(BaseModel):
    id: int
    status: str
    total_price: float
    selected_location: str
    created_at: datetime
    order_items: list[OrderItemResponse] = []

    model_config = ConfigDict(from_attributes=True)


class UserUpdate(BaseModel):
    first_name: str
    last_name: str


class UserResponse(BaseModel):
    id: int
    first_name: str
    last_name: str
    email: EmailStr
    orders: list[OrderResponse] = []

    model_config = ConfigDict(
        from_attributes=True
    )
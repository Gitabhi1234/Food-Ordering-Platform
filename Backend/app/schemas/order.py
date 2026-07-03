from pydantic import BaseModel
from typing import Literal, Optional
from datetime import datetime


class CreateOrder(BaseModel):
    selected_location: str


class OrderResponse(BaseModel):
    id: int
    total_price: float
    selected_location: str
    status: str
    created_at: datetime

    class Config:
        from_attributes = True





class UpdateOrderStatus(BaseModel):
    status: Literal[
        "Placed",
        "Accepted",
        "Preparing",
        "Delivered",
        "Rejected",
        "Dispatched"
    ]
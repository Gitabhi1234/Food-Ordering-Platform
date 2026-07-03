from pydantic import BaseModel
from typing import Optional


class MenuCreate(BaseModel):
    name: str
    description: str
    category_id: int
    price: float
    image: Optional[str] = None
    is_vegetarian: bool
    is_spicy: bool
    available: bool = True


class MenuUpdate(BaseModel):
    name: Optional[str] = None
    description: Optional[str] = None
    category_id: Optional[int] = None
    price: Optional[float] = None
    image: Optional[str] = None
    is_vegetarian: Optional[bool] = None
    is_spicy: Optional[bool] = None
    available: Optional[bool] = None


class AvailabilityUpdate(BaseModel):
    available: bool


class MenuResponse(BaseModel):
    id: int
    name: str
    description: str
    image: Optional[str]
    category_id: int
    is_vegetarian: bool
    is_spicy: bool
    price: float
    available: bool

    class Config:
        from_attributes = True
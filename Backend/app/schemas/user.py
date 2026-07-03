from pydantic import BaseModel, EmailStr

from app.schemas.order import OrderResponse


class UserCreate(BaseModel):
    first_name: str
    last_name: str
    email: EmailStr
    password: str


class UserLogin(BaseModel):
    email: EmailStr
    password: str


class UserResponse(BaseModel):
    id: int
    first_name: str
    last_name: str
    email: EmailStr
    orders: list[OrderResponse] = []

    class Config:
        from_attributes = True

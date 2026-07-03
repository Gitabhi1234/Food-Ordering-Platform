from pydantic import BaseModel, EmailStr, ConfigDict


class AdminUpdate(BaseModel):
    restaurant_name: str
    first_name: str
    last_name: str


class AdminResponse(BaseModel):
    id: int
    restaurant_name: str
    first_name: str
    last_name: str
    email: EmailStr

    model_config = ConfigDict(
        from_attributes=True
    )

class AdminCreate(BaseModel):
    restaurant_name: str
    first_name: str
    last_name: str
    email: EmailStr
    password: str

class AdminLogin(BaseModel):
    email: EmailStr
    password: str
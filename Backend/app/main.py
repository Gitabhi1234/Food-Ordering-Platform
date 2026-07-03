from fastapi import FastAPI
from sqlalchemy import text


import app.models

from app.database.database import engine
from app.routers import menu_item
from app.routers import user, admin
from app.routers import order
from app.routers import ai

from app.routers import upload
from app.routers import dashboard
from app.routers import analytics



from app.routers import cart

from fastapi.middleware.cors import CORSMiddleware

app = FastAPI(
    title="Food Ordering API",
    version="1.0.0"
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
        "http://127.0.0.1:8000",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(ai.router)
app.include_router(dashboard.router)
app.include_router(analytics.router)
app.include_router(upload.router)
app.include_router(order.router)
app.include_router(cart.router)
app.include_router(user.router)
app.include_router(menu_item.router)
app.include_router(admin.router)

@app.get("/")
def root():
    return {
        "message": "Food Ordering Backend Running 🚀"
    }



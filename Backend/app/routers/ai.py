from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.database.database import get_db
from app.services.ai_service import extract_filters
from app.models.menu_item import MenuItem

router = APIRouter(
    prefix="/ai",
    tags=["AI"]
)

@router.post("/search")
def ai_search(body: dict, db: Session = Depends(get_db)):

    filters = extract_filters(body["query"])

    query = db.query(MenuItem).filter(
        MenuItem.available == True
    )

    if filters.get("vegetarian") is not None:
        query = query.filter(
            MenuItem.is_vegetarian == filters["vegetarian"]
        )

    if filters.get("spicy") is not None:
        query = query.filter(
            MenuItem.is_spicy == filters["spicy"]
        )

    if filters.get("max_price"):
        query = query.filter(
            MenuItem.price <= filters["max_price"]
        )

    if filters.get("category"):
        query = query.filter(
            MenuItem.category.has(
                name=filters["category"]
            )
    )

    return query.all()
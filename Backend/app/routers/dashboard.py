from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.database.database import get_db

from app.dependencies.auth import get_current_admin


from app.services.dashboard_service import (
    get_dashboard,
    popular_items,
    weekly_earnings
)
router = APIRouter(
    prefix="/dashboard",
    tags=["Dashboard"]
)

@router.get("/")
def dashboard(
    db: Session = Depends(get_db),
    current_admin=Depends(get_current_admin)
):

    return get_dashboard(
        db,
        current_admin.id
    )

@router.get("/popular-items")
def top_items(
    db: Session = Depends(get_db),
    current_admin=Depends(get_current_admin)
):

    return popular_items(
        db,
        current_admin.id
    )

@router.get("/weekly-earnings")
def earnings(
    db: Session = Depends(get_db),
    current_admin=Depends(get_current_admin)
):

    return weekly_earnings(
        db,
        current_admin.id
    )
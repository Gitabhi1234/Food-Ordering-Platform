from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.database.database import get_db
from app.dependencies.auth import get_current_admin

from app.services.analytics_service import (
    overview,
    monthly_revenue,
    order_status,
    top_items,
    recent_orders
)

router = APIRouter(
    prefix="/analytics",
    tags=["Analytics"]
)

@router.get("/overview")
def analytics_overview(
    db: Session = Depends(get_db),
    current_admin=Depends(get_current_admin)
):
    return overview(db, current_admin.id)


@router.get("/monthly-revenue")
def revenue(
    db: Session = Depends(get_db),
    current_admin=Depends(get_current_admin)
):
    return monthly_revenue(db, current_admin.id)


@router.get("/order-status")
def status_chart(
    db: Session = Depends(get_db),
    current_admin=Depends(get_current_admin)
):
    return order_status(db, current_admin.id)


@router.get("/top-items")
def best_items(
    db: Session = Depends(get_db),
    current_admin=Depends(get_current_admin)
):
    return top_items(db, current_admin.id)


@router.get("/recent-orders")
def latest_orders(
    db: Session = Depends(get_db),
    current_admin=Depends(get_current_admin)
):
    return recent_orders(db, current_admin.id)



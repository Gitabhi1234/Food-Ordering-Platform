from datetime import date

from sqlalchemy import func
from sqlalchemy.orm import Session

from app.models.order import Order
from app.models.order_item import OrderItem
from app.models.menu_item import MenuItem
from datetime import datetime, timedelta

def get_dashboard(db: Session, admin_id: int):

    today = date.today()

    total_orders = db.query(Order).filter(
        Order.admin_id == admin_id
    ).count()

    pending = db.query(Order).filter(
        Order.admin_id == admin_id,
        Order.status == "Placed"
    ).count()

    preparing = db.query(Order).filter(
        Order.admin_id == admin_id,
        Order.status == "Preparing"
    ).count()

    delivered = db.query(Order).filter(
        Order.admin_id == admin_id,
        Order.status == "Delivered"
    ).count()

    revenue = db.query(
        func.sum(Order.total_price)
    ).filter(
        Order.admin_id == admin_id
    ).scalar()

    today_revenue = db.query(
        func.sum(Order.total_price)
    ).filter(
        Order.admin_id == admin_id,
        func.date(Order.created_at) == today
    ).scalar()

    return {
        "total_orders": total_orders,
        "pending_orders": pending,
        "preparing_orders": preparing,
        "delivered_orders": delivered,
        "today_revenue": today_revenue or 0,
        "total_revenue": revenue or 0
    }

def popular_items(db: Session, admin_id: int):

    return (

        db.query(

            MenuItem.name,

            func.sum(OrderItem.quantity).label("sold")

        )

        .join(
            OrderItem,
            MenuItem.id == OrderItem.menu_item_id
        )

        .filter(
            MenuItem.admin_id == admin_id
        )

        .group_by(MenuItem.name)

        .order_by(
            func.sum(OrderItem.quantity).desc()
        )

        .limit(5)

        .all()

    )

def weekly_earnings(db, admin_id: int):

    start = datetime.now() - timedelta(days=6)

    data = (
        db.query(
            func.date(Order.created_at),
            func.sum(Order.total_price)
        )
        .filter(
            Order.admin_id == admin_id,
            Order.status == "Delivered",
            Order.created_at >= start
        )
        .group_by(func.date(Order.created_at))
        .order_by(func.date(Order.created_at))
        .all()
    )

    return [
        {
            "date": str(day),
            "earnings": float(amount)
        }
        for day, amount in data
    ]
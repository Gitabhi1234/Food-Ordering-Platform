from datetime import datetime, timedelta

from sqlalchemy import func
from sqlalchemy.orm import Session

from app.models.order import Order
from app.models.order_item import OrderItem
from app.models.menu_item import MenuItem

def overview(
    db: Session,
    admin_id: int
):

    total_orders = db.query(Order).filter(
        Order.admin_id == admin_id
    ).count()

    revenue = db.query(
        func.sum(Order.total_price)
    ).filter(
        Order.admin_id == admin_id,
        Order.status == "Delivered"
    ).scalar() or 0

    customers = db.query(
        func.count(func.distinct(Order.user_id))
    ).filter(
        Order.admin_id == admin_id
    ).scalar()

    items = db.query(MenuItem).filter(
        MenuItem.admin_id == admin_id
    ).count()

    return {
        "orders": total_orders,
        "revenue": revenue,
        "customers": customers,
        "menu_items": items
    }


def monthly_revenue(
    db: Session,
    admin_id: int
):

    data = (

        db.query(

            func.date(Order.created_at),

            func.sum(Order.total_price)

        )

        .filter(
            Order.admin_id == admin_id,
            Order.status == "Delivered"
        )

        .group_by(func.date(Order.created_at))

        .order_by(func.date(Order.created_at))

        .all()

    )

    return [

        {
            "date": str(day),
            "revenue": float(amount)
        }

        for day, amount in data

    ]

def order_status(
    db: Session,
    admin_id: int
):

    statuses = [

        "Placed",
        "Accepted",
        "Preparing",
        "Delivered",
        "Rejected"

    ]

    result = {}

    for status in statuses:

        result[status] = db.query(Order).filter(

            Order.admin_id == admin_id,

            Order.status == status

        ).count()

    return result

def top_items(
    db: Session,
    admin_id: int
):

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

def top_items(
    db: Session,
    admin_id: int
):

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

def recent_orders(
    db: Session,
    admin_id: int
):

    return db.query(Order).filter(

        Order.admin_id == admin_id

    ).order_by(

        Order.created_at.desc()

    ).limit(10).all()
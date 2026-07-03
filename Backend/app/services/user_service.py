from sqlalchemy.orm import Session
from app.models.user import User


def get_profile(
    db: Session,
    user_id: int
):
    user = (
        db.query(User)
        .filter(User.id == user_id)
        .first()
    )

    if not user:
        return None

    return {
        "id": user.id,
        "first_name": user.first_name,
        "last_name": user.last_name,
        "email": user.email,
        "orders": [
            {
                "id": order.id,
                "status": order.status,
                "total_price": order.total_price,
                "selected_location": order.selected_location,
                "created_at": order.created_at,
                "order_items": [
                    {
                        "id": item.id,
                        "name": item.menu_item.name,
                        "image": item.menu_item.image,
                        "price": item.price,
                        "quantity": item.quantity,
                    }
                    for item in order.order_items
                ],
            }
            for order in user.orders
        ],
    }


def update_profile(
    db: Session,
    user_id: int,
    data
):

    user = db.query(User).filter(
        User.id == user_id
    ).first()

    if not user:
        return None

    user.first_name = data.first_name
    user.last_name = data.last_name

    db.commit()
    db.refresh(user)

    return user
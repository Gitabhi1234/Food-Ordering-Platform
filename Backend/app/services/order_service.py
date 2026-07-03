from sqlalchemy.orm import Session

from app.models.order import Order
from app.models.order_item import OrderItem
from app.models.cart import Cart
from app.models.cart_item import CartItem
from app.models.menu_item import MenuItem

def create_order(
    db: Session,
    user_id: int,
    location: str
):

    cart = db.query(Cart).filter(
        Cart.user_id == user_id
    ).first()

    if not cart:
        return None

    cart_items = db.query(CartItem).filter(
        CartItem.cart_id == cart.id
    ).all()

    if len(cart_items) == 0:
        return None

    total = 0

    admin_id = None

    for item in cart_items:

        menu = db.query(MenuItem).filter(
            MenuItem.id == item.menu_item_id
        ).first()

        total += menu.price * item.quantity

        admin_id = menu.admin_id

    order = Order(
        user_id=user_id,
        admin_id=admin_id,
        total_price=total,
        selected_location=location,
        status="Placed"
    )

    db.add(order)

    db.commit()

    db.refresh(order)

    for item in cart_items:

        menu = db.query(MenuItem).filter(
            MenuItem.id == item.menu_item_id
        ).first()

        order_item = OrderItem(
            order_id=order.id,
            menu_item_id=menu.id,
            quantity=item.quantity,
            price=menu.price
        )

        db.add(order_item)

    db.commit()

    for item in cart_items:

        db.delete(item)

    db.commit()

    return order

def customer_orders(
    db: Session,
    user_id: int
):

    return db.query(Order).filter(
        Order.user_id == user_id
    ).order_by(
        Order.created_at.desc()
    ).all()

def admin_orders(
    db: Session,
    admin_id: int
):

    return db.query(Order).filter(
        Order.admin_id == admin_id
    ).order_by(
        Order.created_at.desc()
    ).all()

def update_status(
    db: Session,
    order_id: int,
    status: str
):

    order = db.query(Order).filter(
        Order.id == order_id
    ).first()

    if not order:
        return None

    order.status = status

    db.commit()

    db.refresh(order)

    return order

def get_order_status(
    db: Session,
    order_id: int
):
    return db.query(Order).filter(
        Order.id == order_id
    ).first()

def order_history(
    db: Session,
    user_id: int
):

    orders = db.query(Order).filter(
        Order.user_id == user_id
    ).order_by(
        Order.created_at.desc()
    ).all()

    result = []

    for order in orders:

        items = db.query(OrderItem).filter(
            OrderItem.order_id == order.id
        ).all()

        order_items = []

        for item in items:

            menu = db.query(MenuItem).filter(
                MenuItem.id == item.menu_item_id
            ).first()

            if not menu:
                continue

            order_items.append({

                "item_name": menu.name,

                "image": menu.image,

                "price": item.price,

                "quantity": item.quantity

            })

        result.append({

            "order_id": order.id,

            "status": order.status,

            "total_price": order.total_price,

            "location": order.selected_location,

            "created_at": order.created_at,

            "items": order_items

        })

    return result
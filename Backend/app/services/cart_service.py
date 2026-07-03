from sqlalchemy.orm import Session

from app.models.cart import Cart
from app.models.cart_item import CartItem
from app.models.menu_item import MenuItem


def add_to_cart(
    db: Session,
    user_id: int,
    menu_item_id: int,
    quantity: int
):

    cart = db.query(Cart).filter(
        Cart.user_id == user_id
    ).first()

    if not cart:

        cart = Cart(
            user_id=user_id
        )

        db.add(cart)
        db.commit()
        db.refresh(cart)

    cart_item = db.query(CartItem).filter(
        CartItem.cart_id == cart.id,
        CartItem.menu_item_id == menu_item_id
    ).first()

    if cart_item:

        cart_item.quantity += quantity

    else:

        cart_item = CartItem(
            cart_id=cart.id,
            menu_item_id=menu_item_id,
            quantity=quantity
        )

        db.add(cart_item)

    db.commit()

    return get_cart(db, user_id)


def get_cart(
    db: Session,
    user_id: int
):

    cart = db.query(Cart).filter(
        Cart.user_id == user_id
    ).first()

    if not cart:

        return {
            "cartItems": []
        }

    cart_items = db.query(CartItem).filter(
        CartItem.cart_id == cart.id
    ).all()

    items = []

    for cart_item in cart_items:

        menu = db.query(MenuItem).filter(
            MenuItem.id == cart_item.menu_item_id
        ).first()

        if not menu:
            continue

        items.append({

            "id": cart_item.id,

            "menu_item_id": menu.id,

            "name": menu.name,

            "price": menu.price,

            "image": menu.image,

            "quantity": cart_item.quantity,

            "admin_id": menu.admin_id

        })

    return {

        "cartItems": items

    }


def remove_item(
    db: Session,
    user_id: int,
    cart_item_id: int
):

    cart = db.query(Cart).filter(
        Cart.user_id == user_id
    ).first()

    if not cart:

        return False

    item = db.query(CartItem).filter(
        CartItem.id == cart_item_id,
        CartItem.cart_id == cart.id
    ).first()

    if not item:

        return False

    db.delete(item)

    db.commit()

    return True


def clear_cart(
    db: Session,
    user_id: int
):

    cart = db.query(Cart).filter(
        Cart.user_id == user_id
    ).first()

    if not cart:

        return

    items = db.query(CartItem).filter(
        CartItem.cart_id == cart.id
    ).all()

    for item in items:

        db.delete(item)

    db.commit()

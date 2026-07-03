from sqlalchemy import Column, Integer, ForeignKey

from sqlalchemy.orm import relationship

from app.database.database import Base


class CartItem(Base):
    __tablename__ = "cart_items"

    id = Column(Integer, primary_key=True)

    cart_id = Column(
        Integer,
        ForeignKey("carts.id")
    )

    menu_item_id = Column(
        Integer,
        ForeignKey("menu_items.id")
    )

    quantity = Column(
        Integer,
        default=1
    )

    cart = relationship(
        "Cart",
        back_populates="cart_items"
    )

    menu_item = relationship(
        "MenuItem",
        back_populates="cart_items"
    )
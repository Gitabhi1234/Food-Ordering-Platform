from sqlalchemy import (
    Column,
    Integer,
    String,
    Float,
    Boolean,
    ForeignKey,
    Text
)

from sqlalchemy.orm import relationship

from app.database.database import Base


class MenuItem(Base):
    __tablename__ = "menu_items"

    id = Column(Integer, primary_key=True)

    name = Column(String(255), nullable=False)

    description = Column(Text, nullable=False)

    image = Column(String)

    price = Column(Float, nullable=False)

    is_vegetarian = Column(Boolean, default=True)

    is_spicy = Column(Boolean, default=False)

    available = Column(Boolean, default=True)

    category_id = Column(
        Integer,
        ForeignKey("categories.id")
    )

    admin_id = Column(
        Integer,
        ForeignKey("admins.id")
    )

    category = relationship(
        "Category",
        back_populates="menu_items"
    )

    admin = relationship(
        "Admin",
        back_populates="menu_items"
    )

    cart_items = relationship(
        "CartItem",
        back_populates="menu_item"
    )

    order_items = relationship(
        "OrderItem",
        back_populates="menu_item"
    )
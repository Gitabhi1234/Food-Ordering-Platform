from sqlalchemy import (
    Column,
    Integer,
    ForeignKey,
    Float,
    String,
    DateTime
)

from sqlalchemy.orm import relationship
from sqlalchemy.sql import func

from app.database.database import Base


class Order(Base):
    __tablename__ = "orders"

    id = Column(Integer, primary_key=True)

    user_id = Column(
        Integer,
        ForeignKey("users.id")
    )

    admin_id = Column(
        Integer,
        ForeignKey("admins.id")
    )

    total_price = Column(
        Float,
        nullable=False
    )

    selected_location = Column(
        String(500),
        nullable=False
    )
    status = Column(
        String,
        default="Placed"
    )

    created_at = Column(
        DateTime(timezone=True),
        server_default=func.now()
    )

    user = relationship(
        "User",
        back_populates="orders"
    )

    admin = relationship(
        "Admin",
        back_populates="orders"
    )

    order_items = relationship(
        "OrderItem",
        back_populates="order",
        cascade="all, delete-orphan"
    )


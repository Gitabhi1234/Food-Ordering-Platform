from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from app.database.database import get_db
from app.dependencies.auth import get_current_user, get_current_admin


from app.schemas.order import (
    CreateOrder,
    OrderResponse,
    UpdateOrderStatus
)



from app.services.order_service import (
    create_order,
    customer_orders,
    get_order_status,
    admin_orders,
    update_status,
    order_history
)

router = APIRouter(
    prefix="/orders",
    tags=["Orders"]
)

@router.post(
    "/",
    response_model=OrderResponse,
    status_code=status.HTTP_201_CREATED
)
def place_order(
    data: CreateOrder,
    db: Session = Depends(get_db),
    current_user=Depends(get_current_user)
):

    order = create_order(
        db,
        current_user.id,
        data.selected_location
    )

    if not order:
        raise HTTPException(
            status_code=400,
            detail="Cart is empty"
        )

    return order


@router.get(
    "/my-orders",
    response_model=list[OrderResponse]
)
def my_orders(
    db: Session = Depends(get_db),
    current_user=Depends(get_current_user)
):

    return customer_orders(
        db,
        current_user.id
    )


@router.get(
    "/coming-orders",
    response_model=list[OrderResponse]
)
def incoming_orders(
    db: Session = Depends(get_db),
    current_admin=Depends(get_current_admin)
):

    return admin_orders(
        db,
        current_admin.id
    )

@router.patch(
    "/{order_id}",
    response_model=OrderResponse
)
def change_status(
    order_id: int,
    body: UpdateOrderStatus,
    db: Session = Depends(get_db),
    current_admin=Depends(get_current_admin)
):

    order = update_status(
        db,
        order_id,
        body.status
    )

    if not order:
        raise HTTPException(
            status_code=404,
            detail="Order not found"
        )

    return order

@router.get("/{order_id}/status")
def order_status(
    order_id: int,
    db: Session = Depends(get_db),
    current_user=Depends(get_current_user)
):

    order = get_order_status(
        db,
        order_id
    )

    if not order:
        raise HTTPException(
            status_code=404,
            detail="Order not found"
        )

    return {
        "order_id": order.id,
        "status": order.status
    }


@router.get("/history")
def history(
    db: Session = Depends(get_db),
    current_user=Depends(get_current_user)
):

    return order_history(
        db,
        current_user.id
    )
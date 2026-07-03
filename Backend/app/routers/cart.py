from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from app.database.database import get_db
from app.dependencies.auth import get_current_user

from app.schemas.cart import CartAddRequest, CartResponse

from app.services.cart_service import (
    add_to_cart,
    get_cart,
    remove_item,
    clear_cart
)

router = APIRouter(
    prefix="/users/cart",
    tags=["Cart"]
)

@router.post(
    "/add",
    response_model=CartResponse,
    status_code=status.HTTP_201_CREATED
)
def add_item(
    body: CartAddRequest,
    db: Session = Depends(get_db),
    current_user=Depends(get_current_user)
):

    return add_to_cart(
        db,
        current_user.id,
        body.menu_item_id,
        body.quantity
    )

@router.get(
    "",
    response_model=CartResponse
)
def cart(
    db: Session = Depends(get_db),
    current_user=Depends(get_current_user)
):

    return get_cart(
        db,
        current_user.id
    )

@router.delete("/{cart_item_id}")
def delete_item(
    cart_item_id: int,
    db: Session = Depends(get_db),
    current_user=Depends(get_current_user)
):

    success = remove_item(
        db,
        current_user.id,
        cart_item_id
    )

    if not success:

        raise HTTPException(
            status_code=404,
            detail="Item not found"
        )

    return {
        "message": "Item removed successfully"
    }

@router.delete("")
def delete_cart(
    db: Session = Depends(get_db),
    current_user=Depends(get_current_user)
):

    clear_cart(
        db,
        current_user.id
    )

    return {
        "message": "Cart cleared"
    }


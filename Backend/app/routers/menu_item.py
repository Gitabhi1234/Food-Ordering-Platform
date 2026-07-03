from fastapi import APIRouter
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from app.database.database import get_db
from app.dependencies.auth import get_current_admin

from app.schemas.menu_item import (
    MenuCreate,
    MenuUpdate,
    AvailabilityUpdate,
    MenuResponse
)

from app.services.menu_service import (
    create_menu_item,
    get_all_admin_items,
    get_all_items,
    get_item,
    update_item,
    delete_item,
    change_availability
)

router = APIRouter(
    prefix="/menu",
    tags=["Menu"]
)

@router.post("/")
def add_menu_item(
    menu: MenuCreate,
    db: Session = Depends(get_db),
    current_admin = Depends(get_current_admin)
):
    item = create_menu_item(
        db,
        menu,
        current_admin.id
    )

    if item is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Category not found"
        )

    return item

@router.get(
    "/",
    response_model=list[MenuResponse]
)
def get_menu(
    db: Session = Depends(get_db)
):
    return get_all_items(db)

@router.get(
    "/admin",
    response_model=list[MenuResponse]
)
def admin_menu(
    db: Session = Depends(get_db),
    current_admin=Depends(get_current_admin)
):

    return get_all_admin_items(
        db,
        current_admin.id
    )

@router.get(
    "/admin",
    response_model=list[MenuResponse]
)
def admin_menu(
    db: Session = Depends(get_db),
    current_admin=Depends(get_current_admin)
):

    return get_all_admin_items(
        db,
        current_admin.id
    )

@router.get(
    "/{item_id}",
    response_model=MenuResponse
)
def single_item(
    item_id: int,
    db: Session = Depends(get_db)
):

    item = get_item(
        db,
        item_id
    )

    if not item:

        raise HTTPException(
            status_code=404,
            detail="Item not found"
        )

    return item


@router.put(
    "/{item_id}",
    response_model=MenuResponse
)
def edit_item(
    item_id: int,
    menu: MenuUpdate,
    db: Session = Depends(get_db),
    current_admin=Depends(get_current_admin)
):

    item = update_item(
        db,
        item_id,
        menu
    )

    if not item:

        raise HTTPException(
            status_code=404,
            detail="Menu item not found"
        )

    return item

@router.delete(
    "/{item_id}"
)
def remove_item(
    item_id: int,
    db: Session = Depends(get_db),
    current_admin=Depends(get_current_admin)
):

    deleted = delete_item(
        db,
        item_id
    )

    if not deleted:

        raise HTTPException(
            status_code=404,
            detail="Menu item not found"
        )

    return {
        "message": "Item deleted successfully"
    }

@router.patch(
    "/{item_id}/availability",
    response_model=MenuResponse
)
def availability(
    item_id: int,
    body: AvailabilityUpdate,
    db: Session = Depends(get_db),
    current_admin=Depends(get_current_admin)
):

    item = change_availability(
        db,
        item_id,
        body.available
    )

    if not item:

        raise HTTPException(
            status_code=404,
            detail="Menu item not found"
        )

    return item
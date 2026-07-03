from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from app.database.database import get_db
from app.schemas.admin import AdminCreate, AdminLogin, AdminResponse, AdminUpdate
from app.services.auth_service import register_admin, login_admin
from app.dependencies.auth import get_current_admin
from app.schemas.menu_item import MenuResponse

router = APIRouter(
    prefix="/admins",
    tags=["Admins"]
)

from app.services.admin_service import (
    get_profile,
    update_profile
)

@router.post("/register")
def admin_register(
    admin: AdminCreate,
    db: Session = Depends(get_db)
):
    result = register_admin(db, admin)

    if not result["success"]:
        raise HTTPException(
            status_code=400,
            detail=result["message"]
        )

    return {
        "admin": result["admin"],
        "token": result["token"]
    }


@router.post("/login")
def admin_login(
    admin: AdminLogin,
    db: Session = Depends(get_db)
):
    result = login_admin(db, admin)

    if not result:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid Email or Password"
        )

    return result

@router.get(
    "/profile",
    response_model=AdminResponse
)
def profile(
    db: Session = Depends(get_db),
    current_admin=Depends(get_current_admin)
):

    return get_profile(
        db,
        current_admin.id
    )

@router.get(
    "/items",
    response_model=list[MenuResponse]
)
def get_admin_items(
    db: Session = Depends(get_db),
    current_admin=Depends(get_current_admin)
):

    return get_admin_items(
        db,
        current_admin.id
    )

@router.put(
    "/profile",
    response_model=AdminResponse
)

def edit_profile(
    data: AdminUpdate,
    db: Session = Depends(get_db),
    current_admin=Depends(get_current_admin)
):

    admin = update_profile(
        db,
        current_admin.id,
        data
    )

    if not admin:
        raise HTTPException(
            status_code=404,
            detail="Admin not found"
        )

    return admin

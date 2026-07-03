from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from app.database.database import get_db
from app.schemas.user import UserCreate, UserLogin
from app.services.auth_service import register_user, login_user

from app.schemas.profile import (
    UserResponse,
    UserUpdate
)

from app.services.user_service import (
    get_profile,
    update_profile
)

from app.dependencies.auth import get_current_user

router = APIRouter(
    prefix="/users",
    tags=["Users"]
)

@router.post("/register")
def user_register(
    user: UserCreate,
    db: Session = Depends(get_db)
):
    result = register_user(db, user)

    if not result:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Email already registered"
        )

    return result

@router.post("/login")
def user_login(
    user: UserLogin,
    db: Session = Depends(get_db)
):
    result = login_user(db, user)

    if not result:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid Email or Password"
        )

    return result

@router.get(
    "/profile",
    response_model=UserResponse
)
def profile(
    db: Session = Depends(get_db),
    current_user=Depends(get_current_user)
):

    return get_profile(
        db,
        current_user.id
    )

@router.put(
    "/profile",
    response_model=UserResponse
)
def edit_profile(
    data: UserUpdate,
    db: Session = Depends(get_db),
    current_user=Depends(get_current_user)
):

    user = update_profile(
        db,
        current_user.id,
        data
    )

    if not user:
        raise HTTPException(
            status_code=404,
            detail="User not found"
        )

    return user


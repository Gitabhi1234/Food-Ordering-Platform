from sqlalchemy.orm import Session

from app.models.user import User
from app.models.admin import Admin

from app.core.security import (
    hash_password,
    verify_password,
    create_access_token
)

def register_user(db: Session, user):

    existing = db.query(User).filter(
        User.email == user.email
    ).first()

    if existing:
        return None

    db_user = User(
        first_name=user.first_name,
        last_name=user.last_name,
        email=user.email,
        hashed_password=hash_password(user.password)
    )

    db.add(db_user)
    db.commit()
    db.refresh(db_user)

    token = create_access_token(
        {
            "sub": db_user.email,
            "role": "user"
        }
    )

    return {
        "user": db_user,
        "token": token
    }

def login_user(db: Session, data):

    user = db.query(User).filter(
        User.email == data.email
    ).first()

    if not user:
        return None

    if not verify_password(
        data.password,
        user.hashed_password
    ):
        return None

    token = create_access_token(
        {
            "sub": user.email,
            "role": "user"
        }
    )

    return {
        "user": user,
        "token": token
    }


from sqlalchemy.orm import Session
from app.models.admin import Admin
from app.utils.auth import hash_password, create_access_token


def register_admin(db: Session, admin):

    # Allow only one admin in the system
    existing_admin = db.query(Admin).first()

    if existing_admin:
        return {
            "success": False,
            "message": "An admin account already exists. Only one admin can be registered."
        }

    db_admin = Admin(
        restaurant_name=admin.restaurant_name,
        first_name=admin.first_name,
        last_name=admin.last_name,
        email=admin.email,
        hashed_password=hash_password(admin.password)
    )

    db.add(db_admin)
    db.commit()
    db.refresh(db_admin)

    token = create_access_token(
        {
            "sub": db_admin.email,
            "role": "admin"
        }
    )

    return {
        "success": True,
        "admin": db_admin,
        "token": token
    }

def login_admin(db: Session, data):

    admin = db.query(Admin).filter(
        Admin.email == data.email
    ).first()

    if not admin:
        return None

    if not verify_password(
        data.password,
        admin.hashed_password
    ):
        return None

    token = create_access_token(
        {
            "sub": admin.email,
            "role": "admin"
        }
    )

    return {
        "admin": admin,
        "token": token
    }
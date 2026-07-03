from fastapi import Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer
from jose import JWTError, jwt
from sqlalchemy.orm import Session

from app.core.config import settings
from app.database.database import get_db
from app.models.user import User
from app.models.admin import Admin

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="/users/login")


from jose import JWTError

def verify_token(token: str = Depends(oauth2_scheme)):
    try:
        payload = jwt.decode(
            token,
            settings.SECRET_KEY,
            algorithms=[settings.ALGORITHM]
        )

        return {
            "sub": payload.get("sub"),
            "role": payload.get("role")
        }

    except JWTError as e:
        print("JWT ERROR:", str(e))
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid Token"
        )

def get_current_user(
    token_data=Depends(verify_token),
    db: Session = Depends(get_db)
):
    if token_data["role"] != "user":
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="User access required"
        )

    user = db.query(User).filter(
        User.email == token_data["sub"]
    ).first()

    if not user:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="User not found"
        )
  
    return user

def get_current_admin(
    token_data=Depends(verify_token),
    db: Session = Depends(get_db)
):
    if token_data["role"] != "admin":
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Admin access required"
        )

    admin = db.query(Admin).filter(
        Admin.email == token_data["sub"]
    ).first()

    if not admin:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Admin not found"
        )

    return admin
from sqlalchemy.orm import Session

from app.models.admin import Admin
from app.models.menu_item import MenuItem


def get_profile(
    db: Session,
    admin_id: int
):
    
    return db.query(Admin).filter(
        Admin.id == admin_id
    ).first()


def update_profile(
    db: Session,
    admin_id: int,
    data
):

    admin = db.query(Admin).filter(
        Admin.id == admin_id
    ).first()

    if not admin:
        return None

    admin.restaurant_name = data.restaurant_name
    admin.first_name = data.first_name
    admin.last_name = data.last_name

    db.commit()
    db.refresh(admin)

    return admin


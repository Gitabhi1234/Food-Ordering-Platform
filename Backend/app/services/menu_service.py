from sqlalchemy.orm import Session

from app.models.menu_item import MenuItem


def create_menu_item(db: Session, menu, admin_id: int):

    item = MenuItem(
        name=menu.name,
        description=menu.description,
        category_id=menu.category_id,
        price=menu.price,
        image=menu.image,
        is_vegetarian=menu.is_vegetarian,
        is_spicy=menu.is_spicy,
        available=menu.available,
        admin_id=admin_id
    )

    db.add(item)
    db.commit()
    db.refresh(item)

    return item


def get_all_admin_items(
        db: Session,
        admin_id: int
):

    return db.query(MenuItem).filter(
        MenuItem.admin_id == admin_id
    ).all()


def get_all_items(db: Session):

    return db.query(MenuItem).all()


def get_item(
        db: Session,
        item_id: int
):

    return db.query(MenuItem).filter(
        MenuItem.id == item_id
    ).first()


def update_item(
        db: Session,
        item_id: int,
        menu
):

    item = db.query(MenuItem).filter(
        MenuItem.id == item_id
    ).first()

    if not item:
        return None

    item.name = menu.name
    item.description = menu.description
    item.category_id = menu.category_id
    item.price = menu.price
    item.image = menu.image
    item.is_vegetarian = menu.is_vegetarian
    item.is_spicy = menu.is_spicy
    item.available = menu.available

    db.commit()
    db.refresh(item)

    return item


def delete_item(
        db: Session,
        item_id: int
):

    item = db.query(MenuItem).filter(
        MenuItem.id == item_id
    ).first()

    if not item:
        return False

    db.delete(item)

    db.commit()

    return True


def change_availability(
        db: Session,
        item_id: int,
        available: bool
):

    item = db.query(MenuItem).filter(
        MenuItem.id == item_id
    ).first()

    if not item:
        return None

    item.available = available

    db.commit()
    db.refresh(item)

    return item
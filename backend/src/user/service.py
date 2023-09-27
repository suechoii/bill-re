from sqlalchemy.orm import Session

import backend.src.user.models as models


def get_friend_by_username(db: Session, friend_username: str):
    friend = db.query(models.User).filter(models.User.username == friend_username).first()
    return friend
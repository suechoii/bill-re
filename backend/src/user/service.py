from sqlalchemy.orm import Session
from sqlalchemy import and_

import backend.src.user.models as models


def get_friend_by_username(db: Session, friend_username: str):
    friend = db.query(models.User).filter(models.User.username == friend_username).first()
    return friend


def add_friend(db: Session, friend: dict):
    friendship = db.query(models.Friendship).\
                        filter( and_
                               (models.Friendship.user_id == friend.user_id, 
                                models.Friendship.friend_id == friend.friend_id )).first()
    
    if friendship:
        return False
    else:
        friend_dict = friend.dict()
        new_friend = models.Friendship(**friend_dict)

        db.add(new_friend)
        db.commit()
        db.refresh(new_friend)

        return True        
    


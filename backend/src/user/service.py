from sqlalchemy.orm import Session
from sqlalchemy import and_

import backend.src.user.models as models
import backend.src.auth.utils as auth_utils
import backend.src.auth.models as auth_models



def get_friend_by_username(db: Session, friend_username: str):
    friend = db.query(models.User).filter(models.User.username == friend_username).first()
    return friend


def check_friendship(db: Session, user_id: int, friend_id: int, friend_username: str):
    friendship = db.query(models.Friendship).\
                        filter(and_
                                (models.Friendship.user_id == user_id,
                                 models.Friendship.friend_id == friend_id)).first()
    if friendship:
        return True
    else:
        return False

def add_friend(db: Session, user_id: int, friend: dict):
    friendship = db.query(models.Friendship).\
                        filter( and_
                               (models.Friendship.user_id == user_id, 
                                models.Friendship.friend_id == friend.friend_id )).first()
    
    if friendship:
        return False
    else:
        friend_dict = friend.dict()
        new_friend = models.Friendship(user_id=user_id, friend_id=friend.friend_id, friend_username=friend.friend_username)

        db.add(new_friend)
        db.commit()
        db.refresh(new_friend)

        return True        
    

def update_password(db: Session, user: models.User, verify_user: auth_models.UserVerify, new_password: str):
    hashed_new_password = auth_utils.bcrypt_password(new_password)
    
    setattr(user, "password", hashed_new_password)
    setattr(verify_user, "password", hashed_new_password)
    db.commit()





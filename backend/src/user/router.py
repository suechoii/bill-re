from fastapi import APIRouter, Depends
from typing import List
from sqlalchemy.orm import Session
from pydantic import EmailStr

from backend.src.database import get_db
from backend.src.user import models
from backend.src.user import schemas
from backend.src.user import service
from backend.src.user import exceptions
import backend.src.auth.service as auth_service
import backend.src.auth.exceptions as auth_exceptions
from backend.src.dependencies import get_current_user

router = APIRouter(
    prefix="/user",
    tags=['user']
)

@router.get('/get-friends/{email}', response_model=List[schemas.MyFriend])
async def all_users (email: EmailStr, db: Session = Depends(get_db), current_user: schemas.User = Depends(get_current_user)) :
    user = auth_service.get_user_by_email(db, email)

    if not user:
        raise exceptions.UserNotFoundException(email=email)

    friends = db.query(models.Friendship).filter(models.Friendship.user_id == user.user_id).all()

    my_friends = []
    for friend in friends:
        my_friend = schemas.MyFriend(
            user_id=friend.user_id,
            friend_id=friend.friend_id,
            friend_username=friend.friend_username
        )
        my_friends.append(my_friend)

    return my_friends


@router.get('/search-friend', response_model=schemas.Friend, dependencies=[Depends(get_current_user)])
async def get_friend(email: str, friend_username: str | None = None, db: Session = Depends(get_db)):
    user = auth_service.get_user_by_email(db, email)

    if not user:
        raise exceptions.UserNotFoundException(email=email)
    
    friend = service.get_friend_by_username(db, friend_username)
    
    if not friend:
        raise exceptions.FriendUsernameNotFoundException(friend_username=friend_username)
    
    is_friend = service.check_friendship(db, user.user_id, friend.user_id, friend.username)

    if email == friend.email:
        raise exceptions.UserCantBeFriend

    if is_friend:
        return { "id": friend.user_id, "username": friend.username, "msg": "Already friend." }


    return { "id": friend.user_id, "username": friend.username, "msg": "" }


@router.post('/add-friend', dependencies=[Depends(get_current_user)])
async def add_friend(friend: schemas.FriendAdd, db: Session = Depends(get_db)):
    user = auth_service.get_user_by_email(db, friend.user_email)
    if not user:
        raise exceptions.UserNotFoundException(email=friend.user_email)
    
    new_friend = service.add_friend(db, user.user_id, friend)

    if not new_friend:
        raise exceptions.FriendAlreadyFriendException(friend_username=friend.friend_username)
    
    return friend


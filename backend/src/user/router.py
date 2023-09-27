from fastapi import APIRouter, Depends
from typing import List
from sqlalchemy.orm import Session

from backend.src.database import get_db
from backend.src.user import models
from backend.src.user import schemas
from backend.src.user import service
from backend.src.user import exceptions
from backend.src.dependencies import get_current_user

router = APIRouter(
    prefix="/user",
    tags=['users']
)

@router.get('', response_model=List[schemas.User])
async def all_users (db: Session = Depends(get_db), current_user: schemas.User = Depends(get_current_user)) :
    return db.query(models.User).all()


@router.get('/search-friend', response_model=schemas.Friend, dependencies=[Depends(get_current_user)])
async def get_friend(friend_username: str | None = None, db: Session = Depends(get_db)):
    friend = service.get_friend_by_username(db, friend_username)

    if not friend:
        raise exceptions.FriendUsernameNotFoundException(friend_username=friend_username)

    return { "id": friend.user_id, "username": friend.username }


@router.post('/add-friend', dependencies=[Depends(get_current_user)])
async def add_friend(friend: schemas.FriendAdd, db: Session = Depends(get_db)):
    new_friend = service.add_friend(db, friend)

    if not new_friend:
        raise exceptions.FriendAlreadyFriendException(friend_username=friend.friend_username)
    
    return friend


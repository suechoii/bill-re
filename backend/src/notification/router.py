from fastapi import APIRouter, Depends, Request
from sqlalchemy.orm import Session
from typing import List
from datetime import timedelta

from backend.src.database import get_db
from backend.src.dependencies import get_current_user
from backend.src.notification.models import Notifications
from backend.src.user.models import PushTokens
from backend.src.notification.schemas import ExponentPushToken, Notification, NotificationList
import backend.src.user.service as user_service
import backend.src.notification.service as noti_service

from backend.src.notification.models import Notifications

router = APIRouter(
    prefix="/notification",
    tags=['notification']
)

# TO DO : Add Pagination 
@router.get('', status_code=200, response_model=NotificationList)
async def get_notifications(username: str, db: Session = Depends(get_db)):
    notifications = db.query(Notifications).filter(Notifications.receiver_username == username)\
        .order_by(Notifications.created_at.desc()).all()


    return {'status_code': '200', 'notifications': notifications}


@router.post('/token', status_code=201)
async def register_token(username: str, token: ExponentPushToken, db: Session = Depends(get_db)):
    old_token = db.query(PushTokens).filter(PushTokens.username == username).first()
    if old_token:
        PushTokens.filter(db, username=username).update(True, token=token.token)
    else:
        PushTokens.create(db, True, username=username, token=token.token)
    return {'status_code': '201'}

    
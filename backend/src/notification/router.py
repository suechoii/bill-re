from fastapi import APIRouter, Depends, BackgroundTasks
from sqlalchemy.orm import Session
from typing import List

from backend.src.database import get_db
from backend.src.dependencies import get_current_user
from backend.src.notification.models import Notifications
from backend.src.user.models import PushTokens
from backend.src.notification.schemas import ExponentPushToken, NotificationList
import backend.src.record.service as record_service
from backend.src.notification.service import send_notification

from backend.src.notification.models import Notifications

router = APIRouter(
    prefix="/notification",
    tags=['notification']
)

# TO DO : Add Pagination 
@router.get('', status_code=200, response_model=NotificationList, dependencies=[Depends(get_current_user)])
async def get_notifications(username: str, db: Session = Depends(get_db)):
    records = record_service.get_records_by_username(username)
    record_ids = [record.record_id for record in records]  
    notifications = db.query(Notifications).filter(Notifications.record_id.in_(record_ids))\
        .order_by(Notifications.created_at.desc()).all()
    return {'status_code': '200', 'notifications': notifications}


@router.post('/token', status_code=201, dependencies=[Depends(get_current_user)])
async def register_token(user_id: int, token: ExponentPushToken, db: Session = Depends(get_db)):
    old_token = db.query(PushTokens).filter(PushTokens.user_id == user_id).first()
    if old_token:
        PushTokens.filter(db, user_id = user_id).update(True, token=token.token)
    else:
        PushTokens.create(db, True, user_id = user_id, token=token.token)
    return {'status_code': '201'}

@router.post("/notify-borrower/", dependencies=[Depends(get_current_user)])
async def notify_borrower(record_id : int,  background_tasks: BackgroundTasks, db: Session = Depends(get_db)):
    background_tasks.add_task(send_notification, record_id, db)
    return {'success' : 'notification sent to borrower'}
from fastapi import APIRouter, Depends, BackgroundTasks, status
from sqlalchemy.orm import Session
from typing import List

from backend.src.database import get_db
from backend.src.dependencies import get_current_user
from backend.src.notification.models import Notifications
from backend.src.user.models import PushTokens
from backend.src.notification.schemas import ExponentPushToken, NotificationList
import backend.src.record.service as record_service
import backend.src.notification.service as notification_service

from backend.src.notification.models import Notifications

router = APIRouter(
    prefix="/notification",
    tags=['notification']
)

# TO DO : Add Pagination 
@router.get('', status_code = status.HTTP_200_OK, response_model=NotificationList, dependencies=[Depends(get_current_user)])
async def get_notifications(username: str, db: Session = Depends(get_db)):
    records = record_service.get_records_by_username(username)
    record_ids = [record.record_id for record in records]  
    notifications = db.query(Notifications).filter(Notifications.record_id.in_(record_ids))\
        .order_by(Notifications.created_at.desc()).all()
    return {'status_code': '200', 'notifications': notifications}


@router.post('/token', status_code = status.HTTP_201_CREATED)
async def register_token(user_id: int, token: ExponentPushToken, db: Session = Depends(get_db)):
    notification_service.update_push_token(user_id,token,db)
    return {'status_code': '201'}


@router.post("/notify-borrower/{record_id}", dependencies=[Depends(get_current_user)])
async def notify_borrower(record_id : int,  background_tasks: BackgroundTasks, db: Session = Depends(get_db)):
    background_tasks.add_task(notification_service.send_notification, record_id, db)
    return {'success' : 'notification sent to borrower'}
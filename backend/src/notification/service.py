from exponent_server_sdk import (
    DeviceNotRegisteredError,
    PushClient,
    PushMessage,
    PushServerError,
    PushTicketError,
)
from requests.exceptions import ConnectionError, HTTPError
from fastapi import APIRouter, Body, Depends
from sqlalchemy.orm import Session
from typing import Optional
from backend.src.database import get_db
from backend.src.user.models import PushTokens
from backend.src.user.models import User
from backend.src.notification.models import Notifications
from backend.src.notification.schemas import ExponentPushToken
from datetime import timedelta

from backend.src.record.service import get_users_by_record_id

def generate_message(token, sender, receiver, created_at):
    result = {
        'to': token,
        'sound': 'default',
    }
    result['body'] = f"{receiver}, don't forget to pay {sender} ! "
    result['data'] = {'created_at': created_at,
                      'from': {'username': sender},
                      'to': {'username': receiver}}

    return result


def send_notification(record_id: int, db: Session):
        sender_id, receiver_id, sender_username, receiver_username = get_users_by_record_id(db,record_id)
        token = db.query(PushTokens).filter(PushTokens.user_id == receiver_id).first()
        new_notification = Notifications (record_id = record_id)
        db.add(new_notification)
        db.commit()
        db.refresh(new_notification)

        if token:
            token = token.token
            try:
                response = PushClient().publish(
                    PushMessage(**generate_message(
                        token, sender_username, receiver_username,  (new_notification.created_at + timedelta(hours=9)).isoformat())))
                response.validate_response()
                print(response)
            except DeviceNotRegisteredError:
                print("DeviceNotRegisteredError")
            except PushServerError:
                print("PushServerError")
            except PushTicketError:
                print("PushTicketError")


def update_push_token(user_id: int, token : ExponentPushToken, db: Session = Depends(get_db)):
    old_token = db.query(PushTokens).filter(PushTokens.user_id == user_id).first()
    user = db.query(User).filter(User.user_id == user_id).first()
    if old_token:
        db.query(PushTokens).filter(PushTokens.user_id == user_id).update({"token": token.token})
    else:
        new_token = PushTokens(user_id=user_id, token=token.token)
        db.add(new_token)
    user.push_token = token.token
    db.commit()



        
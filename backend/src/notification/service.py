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
from backend.src.notification.models import Notifications
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


def send_notification(record_id: int, db: Session = Depends(get_db)):
        sender_id, receiver_id, sender_username, receiver_username = get_users_by_record_id(record_id)
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
            except DeviceNotRegisteredError:
                print("DeviceNotRegisteredError")
            except PushServerError:
                print("PushServerError")
            except PushTicketError:
                print("PushTicketError")





        
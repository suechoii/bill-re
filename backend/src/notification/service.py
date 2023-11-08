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


def generate_message(token, sender, receiver, created_at):
    result = {
        'to': token,
        'sound': 'default',
    }
    result['body'] = f"{receiver}, don't forget to pay {sender} ! "
    result['data'] = {'screen': 'NotiTabPostStack',
                      'created_at': created_at,
                      'from': {'username': sender},
                      'to': {'username': receiver}}

    return result


def send_notification(sender: str, receiver: str, db: Session = Depends(get_db)):

        token = db.query(PushTokens).filter(PushTokens.username == receiver).first()
        new_notification = Notifications (
                            sender_username = sender,
                            receiver_username = receiver
                        )
        db.add(new_notification)
        db.commit()
        db.refresh(new_notification)

        if token:
            token = token.token
            try:
                response = PushClient().publish(
                    PushMessage(**generate_message(
                        token, sender, receiver,  (new_notification.created_at + timedelta(hours=9)).isoformat())))
                response.validate_response()
            except DeviceNotRegisteredError:
                print("DeviceNotRegisteredError")
            except PushServerError:
                print("PushServerError")
            except PushTicketError:
                print("PushTicketError")





        
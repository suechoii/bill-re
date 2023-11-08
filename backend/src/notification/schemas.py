from typing import List, Optional

from pydantic import BaseModel, Field

class ExponentPushToken(BaseModel):
    token: str = Field(..., example='ExponentPushToken[ao8g3tHL8052V33aI9hREo]')

class Notification(BaseModel):
    notification_id: int
    record_id: int
    created_at: str

    class Config:
        orm_mode = True


class NotificationList(BaseModel):
    notifications: List[Optional[Notification]]

    class Config:
        schema_extra = {
            "example": {
              "notifications": [
                {
                  "id": 64,
                  "created_at": "2021-10-03T21:22:34",
                  "sender_name": "qt1017",
                  "receiver_name": "yonghyun",
                }
              ]
            }
        }

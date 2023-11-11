from pydantic import BaseModel

class User(BaseModel):
    email: str
    username: str

    class Config:
        orm_mode = True

class MyFriend(BaseModel):
    user_id: int
    friend_id: int
    friend_username: str


class Friend(BaseModel):
    id: int
    username: str
    msg: str


class FriendAdd(BaseModel):
    user_email: str
    friend_id: int
    friend_username: str
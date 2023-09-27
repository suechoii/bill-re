from pydantic import BaseModel

class User(BaseModel):
    email: str
    username: str

    class Config:
        orm_mode = True


class Friend(BaseModel):
    id: int
    username: str


class FriendAdd(BaseModel):
    user_id: int
    friend_id: int
    friend_username: str
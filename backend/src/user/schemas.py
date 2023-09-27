from pydantic import BaseModel

class User(BaseModel):
    email: str
    username: str

    class Config:
        orm_mode = True


class Friend(BaseModel):
    username: str
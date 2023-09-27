from sqlalchemy import Column, String, Integer, ForeignKey
from sqlalchemy.sql.expression import text
from sqlalchemy.sql.sqltypes import TIMESTAMP

from backend.src.database import Base

class User(Base):
    __tablename__ = "user"
    
    user_id = Column(Integer, primary_key=True, autoincrement=True)
    email = Column(String(100), unique=True, nullable=False)
    username = Column(String(20), unique=True, nullable=True)
    password = Column(String(100), nullable=True)
    created_at = Column(TIMESTAMP(timezone=True), nullable=False, server_default=text('now()'))


class Friendship(Base):
    __tablename__ = "friendship"

    friendship_id = Column(Integer, primary_key=True, autoincrement=True)
    user_id = Column(Integer, ForeignKey('user.user_id'), nullable=False)
    friend_id = Column(Integer, ForeignKey('user.user_id'), nullable=False)
    friend_username = Column(String(20), ForeignKey('user.username'), unique=True, nullable=False)

from sqlalchemy import Column, String, Integer, ForeignKey
from sqlalchemy.sql.expression import text
from sqlalchemy.sql.sqltypes import TIMESTAMP
from sqlalchemy.orm import relationship

from backend.src.database import Base

class User(Base):
    __tablename__ = "user"
    
    user_id = Column(Integer, primary_key=True, autoincrement=True)
    push_token = Column(String(255), ForeignKey('push_tokens.token'))
    email = Column(String(100), unique=True, nullable=False)
    username = Column(String(20), unique=True, nullable=True)
    password = Column(String(100), nullable=True)
    payme_link = Column(String(100), nullable=True)
    created_at = Column(TIMESTAMP(timezone=True), nullable=False, server_default=text('now()'))

class PushTokens(Base):
    __tablename__ = "push_tokens"
    user_id= Column(Integer, ForeignKey('user.user_id'), nullable=False)
    token = Column(String(255), primary_key=True, nullable=False)

class Friendship(Base):
    __tablename__ = "friendship"

    friendship_id = Column(Integer, primary_key=True, autoincrement=True)
    user_id = Column(Integer, ForeignKey('user.user_id'), nullable=False)
    friend_id = Column(Integer, ForeignKey('user.user_id'), nullable=False)
    friend_username = Column(String(20), ForeignKey('user.username'), unique=True, nullable=False)

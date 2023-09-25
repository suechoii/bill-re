from sqlalchemy import Column, String, Integer
from sqlalchemy.sql.expression import text
from sqlalchemy.sql.sqltypes import TIMESTAMP

from backend.src.database import Base

class User(Base):
    __tablename__ = "user"
    
    user_id = Column(Integer, primary_key=True, autoincrement="auto")
    email = Column(String(100), unique=True, nullable=False)
    username = Column(String(20), unique=True, nullable=True)
    verification_code = Column(String(6), nullable=False)
    password = Column(String(100), nullable=True)
    created_at = Column(TIMESTAMP(timezone=True), nullable=False, server_default=text('now()'))
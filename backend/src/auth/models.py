from sqlalchemy import Column, String

from backend.src.database import Base

class UserVerify(Base):
    __tablename__ = "verify"
    email = Column(String(100), primary_key= True, unique=True, nullable=False)
    username = Column(String(20), unique=True, nullable=True)
    verification_code = Column(String(6), nullable=False)
    password = Column(String(100), nullable=True)
    payme_link = Column(String(100), nullable=True)

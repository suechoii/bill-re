from sqlalchemy import Column, String, Float, Integer, Boolean, ForeignKey, TIMESTAMP, text, VARCHAR

from backend.src.database import Base

class Record(Base) :
    __tablename__ = "record"

    record_id = Column(Integer, primary_key=True, autoincrement=True )
    borrow_id = Column(Integer, ForeignKey('borrow.borrow_id'))
    user_id = Column(Integer, ForeignKey('user.user_id'), nullable=False)
    user_username = Column(String(20), nullable=False)
    friend_id = Column(Integer, nullable=False)
    friend_username = Column(String(20), nullable=False)
    amount = Column(Float, nullable=False)
    status = Column(Boolean, nullable=False)
    created_at = Column(TIMESTAMP(timezone=True), nullable=False, server_default=text('now()'))


class Borrow(Base):
    __tablename__ = "borrow"

    borrow_id = Column(Integer, primary_key=True, autoincrement=True) 
    total_amount = Column(Float, nullable=False)
    description = Column(VARCHAR(2000), nullable=False)
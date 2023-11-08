from sqlalchemy import Column, String, ForeignKey, Integer
from sqlalchemy.sql.expression import text
from sqlalchemy.sql.sqltypes import TIMESTAMP

from backend.src.database import Base

class Notifications(Base):
    __tablename__ = "notifications"
    notification_id = Column(Integer, primary_key=True, autoincrement=True )
    sender_username = Column(String(20), ForeignKey("record.user_username", ondelete="cascade"), nullable=False)
    receiver_username = Column(String(20), ForeignKey("record.friend_username", ondelete="cascade"), nullable=False)
    created_at = Column(TIMESTAMP(timezone=True), nullable=False, server_default=text('now()'))
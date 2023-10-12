from pydantic import BaseModel
from typing import Dict

class BorrowRecordCreate(BaseModel):
    friend_and_amount: Dict[str, float]
    description: str




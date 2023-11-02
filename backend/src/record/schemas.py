from pydantic import BaseModel
from typing import Dict, List

class BorrowRecordCreate(BaseModel):
    friend_and_amount: Dict[str, float]


class UpdateRecord(BaseModel):
    record_ids: List[int]
    borrow_id:  int

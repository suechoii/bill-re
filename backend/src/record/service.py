from sqlalchemy import exists
from sqlalchemy.orm import Session
from typing import List

import backend.src.record.schemas as schemas
import backend.src.record.models as models
import backend.src.record.utils as utils
import backend.src.user.service as user_service
import backend.src.user.exceptions as user_exceptions


def create_new_record(db: Session, user_id: int, record: schemas.BorrowRecordCreate):
    total_amount = utils.calculate_total_amount(record.friend_and_amount)

    new_borrow_id = create_new_borrow(db, total_amount, record.description)


    for friend_name, amount in record.friend_and_amount.items():
        friend = user_service.get_friend_by_username(db, friend_name)

        if not friend:
            raise user_exceptions.FriendUsernameNotFoundException

        new_record = models.Record(
            borrow_id = new_borrow_id,
            user_id = user_id,
            friend_id = friend.user_id,
            friend_username = friend_name,
            amount = amount,
            status = False,
        )

        db.add(new_record)
        db.commit()
        db.refresh(new_record)

    return True


def create_new_borrow(db: Session, total_amount: float, description: str):
    new_borrow = models.Borrow(total_amount=total_amount, description=description)

    db.add(new_borrow)
    db.commit()
    db.refresh(new_borrow)

    return new_borrow.borrow_id


def get_lent_record(db: Session, user_id: str):
    lent_record = db.query(models.Record).filter(models.Record.user_id == user_id).all()

    return lent_record
    

def get_borrow_record(db: Session, user_id: str):
    borrow_ids = db.query(models.Record.borrow_id).\
                        filter(models.Record.friend_id == user_id).\
                            distinct().all()
    
    borrow_ids = [borrow_id[0] for borrow_id in borrow_ids]

    borrow_record = get_borrow_record_by_borrow_ids(db, borrow_ids)

    return borrow_record


def get_borrow_record_by_borrow_ids(db: Session, borrow_ids: List[int]):
    borrow_record = db.query(models.Record).\
                        filter(models.Record.borrow_id.in_(borrow_ids)).\
                            all()

    return borrow_record

    
from sqlalchemy import exists, and_
from sqlalchemy.orm import Session
from typing import List

import backend.src.record.schemas as schemas
import backend.src.record.models as models
import backend.src.record.utils as utils
import backend.src.user.service as user_service
import backend.src.user.exceptions as user_exceptions
import backend.src.record.exceptions as record_exceptions


def create_new_record(db: Session, user_id: int, user_username: str, user_payme_link: str, record: schemas.BorrowRecordCreate):
    total_amount = utils.calculate_total_amount(record.friend_and_amount)

    new_borrow_id = create_new_borrow(db, total_amount)

    for friend_name, amount in record.friend_and_amount.items():
        friend = user_service.get_friend_by_username(db, friend_name)

        if not friend:
            raise user_exceptions.FriendUsernameNotFoundException

        new_record = models.Record(
            borrow_id = new_borrow_id,
            user_id = user_id,
            user_username = user_username,
            user_payme_link = user_payme_link, 
            friend_id = friend.user_id,
            friend_username = friend_name,
            amount = amount,
            status = False,
        )

        db.add(new_record)
        db.commit()
        db.refresh(new_record)

    return True


def create_new_borrow(db: Session, total_amount: float):
    new_borrow = models.Borrow(total_amount=total_amount, description="description", overall_status=False)

    db.add(new_borrow)
    db.commit()
    db.refresh(new_borrow)

    return new_borrow.borrow_id


def get_lent_record(db: Session, user_id: str):
    lent_ids = db.query(models.Record.borrow_id).\
                        filter(models.Record.user_id == user_id).\
                            distinct().all()

    lent_ids = [lent_id[0] for lent_id in lent_ids]

    lent_records = db.query(models.Record).filter(models.Record.user_id == user_id).all()

    lent_data = db.query(models.Borrow).filter(models.Borrow.borrow_id.in_(lent_ids)).all()

    lent_records_dict = utils.group_by_borrow_ids(lent_records, lent_data)

    return lent_records_dict
    

# def get_borrow_record(db: Session, user_id: str):
#     borrow_ids = db.query(models.Record.borrow_id).\
#                         filter(models.Record.friend_id == user_id).\
#                             distinct().all()
    
#     borrow_ids = [borrow_id[0] for borrow_id in borrow_ids]

#     borrow_records = get_borrow_record_by_borrow_ids(db, borrow_ids)

#     borrow_data = db.query(models.Borrow).filter(models.Borrow.borrow_id.in_(borrow_ids)).all()

#     borrow_records_dict = utils.group_by_borrow_ids(borrow_records, borrow_data)

#     return borrow_records_dict


def get_borrow_record(db: Session, user_id: str):
    borrow_ids = db.query(models.Record.borrow_id).\
                        filter(models.Record.friend_id == user_id).\
                            distinct().all()
    
    borrow_ids = [borrow_id[0] for borrow_id in borrow_ids]

    borrow_records = get_borrow_record_by_borrow_ids(db, borrow_ids, user_id)

    borrow_data = db.query(models.Borrow).filter(models.Borrow.borrow_id.in_(borrow_ids)).all()

    borrow_records_dict = utils.group_by_borrow_ids(borrow_records, borrow_data)

    return borrow_records_dict


def get_borrow_record_by_borrow_ids(db: Session, borrow_ids: List[int], user_id: int):
    borrow_record = db.query(models.Record).\
                        filter(and_(
                                models.Record.borrow_id.in_(borrow_ids),
                                models.Record.friend_id == user_id)).\
                            all()

    return borrow_record
   

def update_record_status(db: Session, update_data: schemas.UpdateRecord) :
    records = db.query(models.Record).filter(models.Record.record_id.in_(update_data.record_ids)).all()

    if not records:
        raise record_exceptions.RecordNotFoundException

    for record in records:
        record.status = True

    db.commit()
    db.refresh(record)

    all_records_of_borrow_id = db.query(models.Record).filter(models.Record.borrow_id == update_data.borrow_id).all()

    if not all_records_of_borrow_id:
        raise record_exceptions.RecordNotFoundException

    borrow_record = db.query(models.Borrow).filter(models.Borrow.borrow_id == update_data.borrow_id).first()

    if not borrow_record:
        raise record_exceptions.BorrowRecordNotFoundException

    length = len(all_records_of_borrow_id)

    count = 0

    for record in all_records_of_borrow_id:
        if record.status:
            count += 1

    if count == length:
        borrow_record.overall_status = True

        db.commit()
        db.refresh(borrow_record)

    records = db.query(models.Record).filter(models.Record.borrow_id == update_data.borrow_id).all()

    data = db.query(models.Borrow).filter(models.Borrow.borrow_id == update_data.borrow_id).all()
    
    records_dict = utils.group_by_borrow_ids(records, data)
    
    return records_dict
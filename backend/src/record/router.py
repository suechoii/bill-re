from fastapi import APIRouter, Depends
from typing import List
from sqlalchemy.orm import Session
from pydantic import EmailStr

from backend.src.database import get_db
from backend.src.record import models
from backend.src.record import schemas
from backend.src.record import service
from backend.src.record import exceptions
from backend.src.dependencies import get_current_user
import backend.src.auth.service as auth_service
import backend.src.user.exceptions as user_exceptions

router = APIRouter(
    prefix="/record",
    tags=['record']
)


@router.post("/create_borrow_record/{email}", dependencies=[Depends(get_current_user)])
async def create_borrow_record(email: EmailStr, borrow_record: schemas.BorrowRecordCreate, db: Session = Depends(get_db)):
    user = auth_service.get_user_by_email(db, email)

    if not user:
        raise user_exceptions.UserNotFoundException

    success = service.create_new_record(db, user.user_id, borrow_record)

    if not success:
        raise exceptions.CreateNewRecordFail
    
    return { "status": "Successfully created a new record" }


@router.get("/get_record_all/{email}", dependencies=[Depends(get_current_user)])
async def get_record_all(email: EmailStr, db: Session = Depends(get_db)):
    user = auth_service.get_user_by_email(db, email)

    if not user:
        raise user_exceptions.UserNotFoundException

    lent_record = service.get_lent_record(db, user.user_id)

    borrow_record = service.get_borrow_record(db, user.user_id)

    record = lent_record + borrow_record

    sorted_records = sorted(record, key=lambda x: x.created_at, reverse=True)

    return sorted_records


@router.get("/get_borrow_record/{email}", dependencies=[Depends(get_current_user)])
async def get_borrow_record(email: EmailStr, db: Session = Depends(get_db)):
    user = auth_service.get_user_by_email(db, email)

    if not user:
        raise user_exceptions.UserNotFoundException

    borrow_record = service.get_borrow_record(db, user.user_id)

    sorted_borrow_record = sorted(borrow_record, key=lambda x: x.created_at, reverse=True)

    return sorted_borrow_record


@router.get("/get_lent_record/{email}", dependencies=[Depends(get_current_user)])
async def get_lent_record(email: EmailStr, db: Session = Depends(get_db)):
    user = auth_service.get_user_by_email(db, email)

    if not user:
        raise user_exceptions.UserNotFoundException

    lent_record = service.get_lent_record(db, user.user_id)

    sorted_lent_record = sorted(lent_record, key=lambda x: x.created_at, reverse=True)

    return sorted_lent_record

    






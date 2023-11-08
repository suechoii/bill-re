from fastapi import APIRouter, Depends, BackgroundTasks
from typing import List
from sqlalchemy.orm import Session
from pydantic import EmailStr
from fastapi_mail import ConnectionConfig, MessageSchema, FastMail

from backend.src.database import get_db
from backend.src.record import schemas
from backend.src.record import service
from backend.src.record import exceptions
from backend.src.record.models import Record
from backend.src.dependencies import get_current_user
import backend.src.auth.service as auth_service
import backend.src.user.service as user_service
from backend.src.email.config import get_email_settings
from backend.src.notification.service import send_notification
import backend.src.user.exceptions as user_exceptions
import backend.src.auth.utils as utils

router = APIRouter(
    prefix="/record",
    tags=['record']
)


@router.post("/create-borrow-record/{email}", dependencies=[Depends(get_current_user)])
async def create_borrow_record(email: EmailStr, borrow_record: schemas.BorrowRecordCreate, background_tasks : BackgroundTasks, db: Session = Depends(get_db)):
    user = auth_service.get_user_by_email(db, email)

    if not user:
        raise user_exceptions.UserNotFoundException

    success = service.create_new_record(db, user.user_id, user.username, user.payme_link, borrow_record)

    if not success:
        raise exceptions.CreateNewRecordFail


    settings = get_email_settings()


    conf = ConnectionConfig(
            MAIL_FROM=settings.gmail_sender,
            MAIL_USERNAME=settings.gmail_sender,
            MAIL_PASSWORD=settings.gmail_password,
            MAIL_PORT=587,
            MAIL_SERVER="smtp.gmail.com",
            MAIL_TLS= True,
            MAIL_SSL= False,
            USE_CREDENTIALS= True,
            TEMPLATE_FOLDER="backend/src/email"
    )
 
    usernames = borrow_record.friend_and_amount.keys()
    for friend_username in usernames:
       
        friend = user_service.get_friend_by_username(db, friend_username)
        friend_email = friend.email
        owed_amount = borrow_record.friend_and_amount[friend_username]

        email_body  = utils.read_html_content_and_replace({"{friend_name}": friend_username, "owed_amount": str(owed_amount)},"backend/src/email/reminder.html")

        message = MessageSchema(
            subject = "[BillRe] Please verify your email address",
            recipients = [EmailStr(friend_email)] ,
            html=email_body,
            subtype="html"
        )

        fm = FastMail(conf)
        background_tasks.add_task(fm.send_message, message)

    
    return { "status": "Successfully created a new record" }


@router.get("/get-record-all/{email}", dependencies=[Depends(get_current_user)])
async def get_record_all(email: EmailStr, db: Session = Depends(get_db)):
    user = auth_service.get_user_by_email(db, email)

    if not user:
        raise user_exceptions.UserNotFoundException

    lent_record = service.get_lent_record(db, user.user_id)

    borrow_record = service.get_borrow_record(db, user.user_id)

    record = {**lent_record, **borrow_record}

    sorted_records = dict(sorted(record.items(), key=lambda x: int(x[0]), reverse=True))

    return sorted_records


@router.get("/get-borrow-record/{email}", dependencies=[Depends(get_current_user)])
async def get_borrow_record(email: EmailStr, db: Session = Depends(get_db)):
    user = auth_service.get_user_by_email(db, email)

    if not user:
        raise user_exceptions.UserNotFoundException

    borrow_record = service.get_borrow_record(db, user.user_id)

    sorted_borrow_record = dict(sorted(borrow_record.items(), key=lambda x: int(x[0]), reverse=True))

    return sorted_borrow_record


@router.get("/get-lent-record/{email}", dependencies=[Depends(get_current_user)])
async def get_lent_record(email: EmailStr, db: Session = Depends(get_db)):
    user = auth_service.get_user_by_email(db, email)

    if not user:
        raise user_exceptions.UserNotFoundException

    lent_record = service.get_lent_record(db, user.user_id)

    sorted_lent_record = dict(sorted(lent_record.items(), key=lambda x: int(x[0]), reverse=True))

    return sorted_lent_record

    
@router.put("/update-record-status/", dependencies=[Depends(get_current_user)])
async def update_status(update_data: schemas.UpdateRecord, db: Session = Depends(get_db)):

   return service.update_record_status(db, update_data)
    
    #check if user has authority to update status of the corresponding record

@router.post("/notify-borrower/", dependencies=[Depends(get_current_user)])
async def notify_borrower(record_id : int,  background_tasks: BackgroundTasks, db: Session = Depends(get_db)):
    sender, receiver = service.get_borrow_record_by_record_id(record_id)
    background_tasks.add_task(send_notification, sender, receiver, db)

    return {'success' : 'notification sent to borrower'}
    




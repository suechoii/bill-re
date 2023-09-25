from fastapi import APIRouter, Depends, status
from sqlalchemy.orm import Session
from fastapi_mail import FastMail, MessageSchema, ConnectionConfig
from pydantic import EmailStr


from backend.src.database import get_db
import backend.src.auth.schemas as schemas
import backend.src.auth.utils as utils
import backend.src.auth.service as service
import backend.src.auth.exceptions as exceptions
from backend.src.auth.config import get_jwt_settings
from backend.src.email.config import get_email_settings
from backend.src.auth.models import UserVerify
from backend.src.user.models import User
from backend.src.auth.schemas import UserCreate
import backend.src.auth.utils as utils

settings = get_email_settings()
router = APIRouter(
    prefix="/auth",
    tags=["auth"]
)

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

@router.post("/register/verification", status_code=status.HTTP_200_OK)
async def verify_email(verification_info: schemas.UserCreate, db: Session = Depends(get_db)):

    if service.get_user_by_email(db,verification_info.email) :
        raise exceptions.EmailAlreadyExistsException(email=verification_info.email)

    if service.check_username_exists(db,verification_info.username) :
        raise exceptions.UsernameAlreadyExistsException(username=verification_info.username)

    if len(verification_info.password) < 6 :
        raise exceptions.PasswordTooShortException()
    
    hashed_password = utils.bcrypt_password(password= verification_info.password)

    verification_code = utils.generate_verification_code()
    
    email_body  = utils.read_html_content_and_replace({"verification_code":verification_code},"backend/src/email/verification.html")

    message = MessageSchema(
        subject = "[BillRe] Please verify your email address",
        recipients = [EmailStr(verification_info.email)] ,
        html=email_body,
        subtype="html"
    )

    fm = FastMail(conf)
    await fm.send_message(message)
    
    # temporary record
    # [TO DO: Add a timestamp and delete record if time has passed over 30 minutes]
    temp_user = service.check_if_code_resent(db, email= verification_info.email)
    if temp_user:
        db.delete(temp_user)
        db.commit()

    user = UserVerify(email=verification_info.email, username=verification_info.username, verification_code=verification_code, password=hashed_password)
    db.add(user)
    db.commit()
    db.refresh(user)

    return {"status" : "email successfully sent", "verification code": verification_code}
    
@router.post("/register/checkcode", status_code=status.HTTP_200_OK)
async def verify_code(verify_code: schemas.CodeVerify, db: Session = Depends(get_db)):

    if service.get_verification_code_by_email(db, verify_code.email) != verify_code.code :
        raise exceptions.VerificationCodeIncorrectException()

    # add to permanent record once verified
    temp_user = service.get_temporary_user_details_by_email(db,verify_code.email)
    verified_user = User(email=verify_code.email, username=temp_user.username, password=temp_user.password)

    db.add(verified_user)
    db.commit()
    db.refresh(verified_user)

    return {"status" : "code successfully verified"}

     


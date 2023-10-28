from fastapi import APIRouter, Depends, status, HTTPException
from fastapi.security import OAuth2PasswordRequestForm
from sqlalchemy.orm import Session
from fastapi_mail import FastMail, MessageSchema, ConnectionConfig
from pydantic import EmailStr
from typing import Annotated
import re

from backend.src.database import get_db
import backend.src.auth.schemas as schemas
import backend.src.auth.utils as utils
import backend.src.auth.service as service
import backend.src.user.service as user_service
import backend.src.auth.exceptions as exceptions
import backend.src.user.exceptions as user_exceptions
from backend.src.auth.config import get_jwt_settings
from backend.src.email.config import get_email_settings
from backend.src.auth.models import UserVerify
from backend.src.user.models import User
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

pattern = r"^https://payme\.hsbc"

@router.post("/register/verification", status_code=status.HTTP_200_OK)
async def verify_email(verification_info: schemas.UserCreate, db: Session = Depends(get_db)):

    if service.get_user_by_email(db,verification_info.email) :
        raise exceptions.EmailAlreadyExistsException(email=verification_info.email)

    if service.check_username_exists(db,verification_info.username) :
        raise exceptions.UsernameAlreadyExistsException(username=verification_info.username)

    if len(verification_info.password) < 6 :
        raise exceptions.PasswordTooShortException()

    if not re.match(pattern, verification_info.payme_link):
        raise exceptions.NotValidPaymeLink
    
    hashed_password = utils.bcrypt_password(password=verification_info.password)

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

    user = UserVerify(email=verification_info.email, 
                      username=verification_info.username, 
                      verification_code=verification_code, 
                      password=hashed_password,
                      payme_link=verification_info.payme_link)
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
    verified_user = User(email=verify_code.email, 
                         username=temp_user.username, 
                         password=temp_user.password,
                         payme_link=temp_user.payme_link)

    db.add(verified_user)
    db.commit()
    db.refresh(verified_user)

    return {"status" : "code successfully verified"}


@router.post("/login")
async def login(form_data: Annotated[OAuth2PasswordRequestForm, Depends()], db: Session = Depends(get_db)): 
    user = db.query(User).filter(
        User.email == form_data.username or User.username == form_data.username).first()
    if not user: 
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, detail=f"Invalid username or email address")

    if not utils.verify_password(user.password, form_data.password):
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, detail=f"Incorrect password")

    access_token = utils.create_access_token(
        data={"sub": user.email}
    )
    return {"user_id": user.user_id, "access_token": access_token, "token_type": "bearer", "email": user.email, "payme_link": user.payme_link, "username": user.username}


@router.post("/reset-password/email/{email}")
async def send_reset_pwd_verification_code(
    email: EmailStr,  
    db: Session = Depends(get_db)):
    '''
    1) Accept user email.
    2) Send an email with verification code.
    3) User verifies with the received verification code.
    4) User enters new password and confirm new password.
    '''
    user = service.get_user_by_email(db, email)

    if not user:
        raise user_exceptions.UserNotFoundException(email)

    verify_user = service.get_temporary_user_details_by_email(db, email)

    verification_code = utils.generate_verification_code()
    
    email_body  = utils.read_html_content_and_replace({"verification_code":verification_code},"backend/src/email/reset_password.html")

    message = MessageSchema(
        subject = "[BillRe] Please verify your verficiation code",
        recipients = [EmailStr(email)] ,
        html=email_body,
        subtype="html"
    )

    fm = FastMail(conf)
    await fm.send_message(message)
    
    service.update_user_verification_code(db, verify_user, verification_code)

    return {"status" : "email successfully sent", "verification code": verification_code}


@router.post('/reset-password/check-code')
def verify_code_for_reset_password(code_info: schemas.CodeVerify, db: Session=Depends(get_db)):

    if service.get_verification_code_by_email(db, code_info.email) != code_info.code:
        raise exceptions.VerificationCodeIncorrectException()

    return {"status" : "Verified successfully for reset password"}


@router.patch('/reset-password/{email}', status_code=status.HTTP_200_OK)
async def reset_password(email: EmailStr, updated_pwd: schemas.ResetPasswordIn, db: Session=Depends(get_db)):
    updated_pwd = updated_pwd.dict()
    user = service.get_user_by_email(db, email)
    verify_user = service.get_temporary_user_details_by_email(db, email)

    if not user:
        raise user_exceptions.UserNotFoundException(email)
        
    if len(updated_pwd['new_password']) < 6 :
        raise exceptions.PasswordTooShortException()

    user_service.update_password(db, user, verify_user, updated_pwd['new_password'])

    return {"status" : "Successfully updated password"}

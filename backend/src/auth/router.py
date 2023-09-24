from fastapi import APIRouter, Depends, status
from sqlalchemy.orm import Session
from fastapi import Request
from fastapi_mail import FastMail, MessageSchema, ConnectionConfig
from pydantic import EmailStr


#from backend.src.database import get_db
import backend.src.auth.schemas as schemas
import backend.src.auth.utils as utils
import backend.src.auth.service as service
from backend.src.auth.config import get_jwt_settings
from backend.src.email.config import get_email_settings
from backend.src.auth.schemas import VerifyEmail
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
async def verify_email(verification_info: schemas.VerifyEmail, request: Request):

    #[TO DO:] check if email has already been registered

    verification_code = utils.generate_verification_code()
    
    email_body  = utils.read_html_content_and_replace({"verification_code":verification_code},"backend/src/email/verification.html")

    message = MessageSchema(
        subject = "[BillRe] Please very your email address",
        recipients = [EmailStr(verification_info.email)] ,
        html=email_body,
        subtype="html"
    )

    fm = FastMail(conf)
    await fm.send_message(message)
 
    return {"status" : "email successfully sent", "verification code": verification_code}
    
    


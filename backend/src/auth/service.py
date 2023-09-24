import string, random

from fastapi_mail import FastMail, MessageSchema, ConnectionConfig

from backend.src.email.config import get_email_settings
from backend.src.auth.schemas import VerifyEmail
import backend.src.auth.utils as utils

settings = get_email_settings()


async def send_email(email: VerifyEmail) :

    conf = ConnectionConfig(
        MAIL_USERNAME=settings.gmail_sender,
        MAIL_PASSWORD=settings.gmail_password,
        MAIL_PORT=587,
        MAIL_SERVER="smtp.gmail.com",
        MAIL_TLS=True,
        MAIL_SSL=False
    )

    verification_code = utils.generate_verification_code()
    
    message = MessageSchema(
        subject = "[BillRe] Please very your email address",
        recipients = email.email,
        body = utils.read_html_content_and_replace(
            replacements={"VERIFICATION_CODE": verification_code},
            html_path="backend/src/email/verification.html"
        ),   
        subtype="html"
    )

    fm = FastMail(conf)
    await fm.send_message(message)
 
    return {"status" : "email successfully sent", "verification code": verification_code}
    
    

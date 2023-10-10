from sqlalchemy.orm import Session

from backend.src.user.models import User
from backend.src.auth.models import UserVerify

def get_verification_code_by_email(db:Session, email: str):
    code = db.query(UserVerify).filter(UserVerify.email == email).first().verification_code

    return code

def get_temporary_user_details_by_email(db:Session, email: str):
    temp_user = db.query(UserVerify).filter(UserVerify.email == email).first()

    return temp_user
  
def get_user_by_email(db:Session, email: str):
    user = db.query(User).filter(User.email == email).first()

    return user

def check_username_exists(db:Session, username: str):
    user = db.query(User).filter(User.username == username).first()

    return user
    
def check_if_code_resent(db:Session, email:str):
    user = db.query(UserVerify).filter(UserVerify.email == email).first()

    return user

def update_user_verification_code(db:Session, verify_user: UserVerify, verification_code:str):
    setattr(verify_user, "verification_code", verification_code)
    db.commit()
from sqlalchemy.orm import Session

from backend.src.user.models import User


def get_verification_code_by_user_id(db:Session, email: str):
    code = db.query(User).filter(User.email == email).first().verification_code

    return code

  

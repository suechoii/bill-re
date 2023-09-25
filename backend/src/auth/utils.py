import string, random
from passlib.context import CryptContext
from datetime import datetime, timedelta
from jose import jwt, JWTError
from typing import Annotated

from backend.src.auth import config
from backend.src.auth import schemas

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

def bcrypt_password(password: str):
    return pwd_context.hash(password)

def verify_password(hashed_password: str, plain_password: str):
    return pwd_context.verify(plain_password, hashed_password)

def generate_verification_code(len=6):
    return ''.join(
        random.choice(string.digits) for _ in range(len)
    )

def read_html_content_and_replace(
    replacements: dict[str, str],
    html_path: str 
):
    f = open(html_path)
    content = f.read()
    for target, val in replacements.items():
        content = content.replace(target, val)
    f.close()
 
    return content

def create_access_token(data: dict):
    to_encode = data.copy()
    expire = datetime.utcnow() + timedelta(minutes=config.get_jwt_settings().ACCESS_TOKEN_EXPIRE_MINUTES)
    to_encode.update({"exp": expire})
    encoded_jwt = jwt.encode(to_encode, config.get_jwt_settings().SECRET_KEY, algorithm=config.get_jwt_settings().ALGORITHM)
    return encoded_jwt

def verify_token(token: Annotated, credentials_exception):
    try:
        payload = jwt.decode(token, config.get_jwt_settings().SECRET_KEY, algorithms=[config.get_jwt_settings().ALGORITHM])
        email: str = payload.get("sub")
        if email is None:
            raise credentials_exception
        token_data = schemas.TokenData(email=email)
    except JWTError:
        raise credentials_exception
        
    return token_data
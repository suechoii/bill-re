from fastapi import HTTPException, status 
from email_validator import validate_email, EmailNotValidError
from pydantic import validator, BaseModel
import backend.src.auth.exceptions as exceptions


class UserCreate(BaseModel):
    email: str
    username: str
    password: str
    payme_link: str
    
    @validator('email')
    def email_must_be_valid(email):
        try:
            validation = validate_email(email)
            email = validation.normalized
        except EmailNotValidError as e:
            raise exceptions.EmailNotValidException()
        
        return email

class CodeVerify(BaseModel):
    email: str
    code: str

class Token(BaseModel):
    access_token: str
    token_type: str

class TokenData(BaseModel):
    email: str

class ResetPasswordIn(BaseModel):
    new_password: str
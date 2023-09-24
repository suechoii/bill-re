from fastapi import HTTPException, status 
from email_validator import validate_email, EmailNotValidError
from pydantic import validator, BaseModel

import backend.src.auth.exceptions as exceptions


class VerifyEmail(BaseModel):
    email: str
    
    @validator('email')
    def email_must_be_valid(email):
        try:
            validation = validate_email(email)
            email = validation.normalized
        except EmailNotValidError as e:
            raise exceptions.EmailNotValidException()
        
        return email
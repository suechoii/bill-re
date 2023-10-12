from fastapi import HTTPException, status

class VerificationCodeIncorrectException(HTTPException):
    def __init__(self):
        self.status_code = status.HTTP_400_BAD_REQUEST
        self.detail = "Incorrect verification code. Please try again."

class EmailNotValidException(HTTPException):
    def __init__(self):
        self.status_code = status.HTTP_400_BAD_REQUEST
        self.detail = "You must provide a valid email address type (ex. xxx@gmail.com)"
        
class EmailAlreadyExistsException(HTTPException):
    def __init__(self, email: str):
        self.status_code = status.HTTP_400_BAD_REQUEST
        self.detail = f"Email: {email} already exists."     
    
class UsernameAlreadyExistsException(HTTPException):
    def __init__(self, username: str):
        self.status_code = status.HTTP_400_BAD_REQUEST
        self.detail = f"{username} already exists. Please choose a different username."
    
class PasswordTooShortException(HTTPException):
    def __init__(self):
        self.status_code = status.HTTP_400_BAD_REQUEST
        self.detail = "Please enter a password of length 6 or above"   

class CredentialsException(HTTPException):
    def __init__(self):
        self.status_code = status.HTTP_401_UNAUTHORIZED
        self.detail = "Could not validate credentials"
        self.headers = {"WWW-Authenticate": "Bearer"}
        
class InvalidEmailOrPasswordException(HTTPException):
    def __init__(self):
        self.status_code = status.HTTP_401_UNAUTHORIZED
        self.detail = "Incorrect email or password"
        self.headers = {"WWW-Authenticate": "Bearer"}

class NotValidPaymeLink(HTTPException):
    def __init__(self):
        self.status_code = status.HTTP_400_BAD_REQUEST
        self.detail = "Your payme link should start with https://payme.hsbc/{username}"
        
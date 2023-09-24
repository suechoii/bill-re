import string, random
from passlib.context import CryptContext

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
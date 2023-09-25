from fastapi import Depends, FastAPI

from backend.src.auth.router import router as auth_router
from backend.src.user.router import router as user_router

app = FastAPI()

app.include_router(auth_router)
app.include_router(user_router)


from fastapi import Depends, FastAPI

from backend.src.auth.router import router as auth_router
from backend.src.user.router import router as user_router
from backend.src.record.router import router as record_router

app = FastAPI()

app.include_router(auth_router)
app.include_router(user_router)
app.include_router(record_router)


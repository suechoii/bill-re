from fastapi import Depends, FastAPI
from fastapi.middleware.cors import CORSMiddleware

from backend.src.auth.router import router as auth_router
from backend.src.user.router import router as user_router
from backend.src.record.router import router as record_router
from backend.src.notification.router import router as noti_router

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(auth_router)
app.include_router(user_router)
app.include_router(record_router)
app.include_router(noti_router)

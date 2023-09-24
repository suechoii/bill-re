from fastapi import Depends, FastAPI

from backend.src.auth.router import router as auth_router

app = FastAPI()

app.include_router(auth_router)


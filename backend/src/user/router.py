from fastapi import APIRouter, Depends
from typing import List
from sqlalchemy.orm import Session

from backend.src.database import get_db
from backend.src.user import models
from backend.src.user import schemas
from backend.src.dependencies import get_current_user

router = APIRouter(
    prefix="/user",
    tags=['users']
)

@router.get('', response_model=List[schemas.User])
async def all_users (db: Session = Depends(get_db), current_user: schemas.User = Depends(get_current_user)) :
    return db.query(models.User).all()

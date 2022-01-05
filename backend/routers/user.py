from fastapi import APIRouter, Depends
from sqlalchemy.orm.session import Session
from db.database import get_db
from routers.schemas import UserBase, UserDisplay
from db.db_user import create_user

router = APIRouter(
   prefix='/user',
   tags=['user']
)

@router.post("/", response_model=UserDisplay)
def create_profile(request: UserBase, db: Session = Depends(get_db)):
   return create_user(db, request)
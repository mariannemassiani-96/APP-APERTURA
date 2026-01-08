from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
import structlog

from app.db import get_db
from app.models import User, UserRole
from app.schemas import UserCreate, UserOut
from app.security import get_current_user, hash_password, require_admin

router = APIRouter(prefix="/admin", tags=["admin"])
logger = structlog.get_logger()


def _require_admin(user: User = Depends(get_current_user)) -> User:
    require_admin(user)
    return user


@router.get("/users", response_model=list[UserOut])
def list_users(
    _: User = Depends(_require_admin),
    db: Session = Depends(get_db),
):
    return db.query(User).order_by(User.created_at.desc()).all()


@router.post("/users", response_model=UserOut, status_code=status.HTTP_201_CREATED)
def create_user(
    payload: UserCreate,
    current_user: User = Depends(_require_admin),
    db: Session = Depends(get_db),
):
    existing = db.query(User).filter(User.email == payload.email).first()
    if existing:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Email already used")
    user = User(
        email=payload.email,
        password_hash=hash_password(payload.password),
        role=UserRole(payload.role),
    )
    db.add(user)
    db.commit()
    db.refresh(user)
    logger.info("admin_user_created", admin_id=current_user.id, user_id=user.id)
    return user

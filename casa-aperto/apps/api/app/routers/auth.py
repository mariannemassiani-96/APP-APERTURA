from fastapi import APIRouter, Depends, HTTPException, Response, status
from sqlalchemy.orm import Session
import structlog

from app.db import get_db
from app.models import User, UserRole
from app.schemas import LoginRequest, UserOut
from app.security import (
    clear_auth_cookies,
    create_access_token,
    create_refresh_token,
    get_current_user,
    hash_password,
    set_auth_cookies,
    verify_password,
)

router = APIRouter(prefix="/auth", tags=["auth"])
logger = structlog.get_logger()


@router.post("/bootstrap", response_model=UserOut)
def bootstrap(db: Session = Depends(get_db)):
    exists = db.query(User).first()
    if exists:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Users already exist")
    user = User(
        email="admin@casa-aperto.local",
        password_hash=hash_password("Admin123!"),
        role=UserRole.admin,
    )
    db.add(user)
    db.commit()
    db.refresh(user)
    logger.info("bootstrap_admin", email=user.email)
    return user


@router.post("/login")
def login(payload: LoginRequest, response: Response, db: Session = Depends(get_db)):
    user = db.query(User).filter(User.email == payload.email).first()
    if not user or not verify_password(payload.password, user.password_hash):
        logger.info("login_failed", email=payload.email)
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid credentials")

    access_token = create_access_token(user.email, user.role)
    refresh_token = create_refresh_token(user.email, user.role)
    set_auth_cookies(response, access_token, refresh_token)
    logger.info("login_success", email=user.email, role=user.role)
    return {"message": "Logged in"}


@router.post("/logout")
def logout(response: Response):
    clear_auth_cookies(response)
    return {"message": "Logged out"}


@router.get("/me", response_model=UserOut)
def me(current_user: User = Depends(get_current_user)):
    return current_user

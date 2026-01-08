from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
import structlog

from app.db import get_db
from app.models import Opening, Project, User
from app.schemas import OpeningCreate, OpeningOut, ProjectCreate, ProjectOut
from app.security import get_current_user

router = APIRouter(prefix="/projects", tags=["projects"])
logger = structlog.get_logger()


@router.get("", response_model=list[ProjectOut])
def list_projects(current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    return db.query(Project).filter(Project.owner_id == current_user.id).all()


@router.post("", response_model=ProjectOut, status_code=status.HTTP_201_CREATED)
def create_project(
    payload: ProjectCreate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    project = Project(
        name=payload.name,
        building_type=payload.building_type,
        owner_id=current_user.id,
    )
    db.add(project)
    db.commit()
    db.refresh(project)
    logger.info("project_created", project_id=project.id, owner_id=current_user.id)
    return project


def _get_project_or_404(project_id: int, user: User, db: Session) -> Project:
    project = (
        db.query(Project).filter(Project.id == project_id, Project.owner_id == user.id).first()
    )
    if not project:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Project not found")
    return project


@router.get("/{project_id}/openings", response_model=list[OpeningOut])
def list_openings(
    project_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    project = _get_project_or_404(project_id, current_user, db)
    return db.query(Opening).filter(Opening.project_id == project.id).all()


@router.get("/{project_id}/openings/{opening_id}", response_model=OpeningOut)
def get_opening(
    project_id: int,
    opening_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    project = _get_project_or_404(project_id, current_user, db)
    opening = (
        db.query(Opening)
        .filter(Opening.id == opening_id, Opening.project_id == project.id)
        .first()
    )
    if not opening:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Opening not found")
    return opening


@router.post("/{project_id}/openings", response_model=OpeningOut, status_code=201)
def create_opening(
    project_id: int,
    payload: OpeningCreate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    project = _get_project_or_404(project_id, current_user, db)
    opening = Opening(
        project_id=project.id,
        type=payload.type,
        width=payload.width,
        height=payload.height,
        quantity=payload.quantity,
    )
    db.add(opening)
    db.commit()
    db.refresh(opening)
    logger.info("opening_created", opening_id=opening.id, project_id=project.id)
    return opening

from __future__ import annotations

import enum

from sqlalchemy import Column, DateTime, Enum, ForeignKey, Integer, String, func
from sqlalchemy.orm import relationship

from app.db import Base


class UserRole(str, enum.Enum):
    admin = "admin"
    sales = "sales"


class BuildingType(str, enum.Enum):
    villa_mediterraneenne = "villa_mediterraneenne"
    villa_moderne = "villa_moderne"
    renovation_corse = "renovation_corse"
    immeuble = "immeuble"
    pavillon = "pavillon"


class OpeningType(str, enum.Enum):
    window = "window"
    french_door = "french_door"
    sliding = "sliding"
    pocket_sliding = "pocket_sliding"
    fixed = "fixed"
    door = "door"


class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True)
    email = Column(String(255), unique=True, index=True, nullable=False)
    password_hash = Column(String(255), nullable=False)
    role = Column(Enum(UserRole, name="user_role"), nullable=False)
    created_at = Column(DateTime(timezone=True), server_default=func.now(), nullable=False)

    projects = relationship("Project", back_populates="owner", cascade="all, delete-orphan")


class Project(Base):
    __tablename__ = "projects"

    id = Column(Integer, primary_key=True)
    name = Column(String(80), nullable=False)
    building_type = Column(Enum(BuildingType, name="building_type"), nullable=False)
    owner_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    created_at = Column(DateTime(timezone=True), server_default=func.now(), nullable=False)

    owner = relationship("User", back_populates="projects")
    openings = relationship("Opening", back_populates="project", cascade="all, delete-orphan")


class Opening(Base):
    __tablename__ = "openings"

    id = Column(Integer, primary_key=True)
    project_id = Column(Integer, ForeignKey("projects.id"), nullable=False, index=True)
    type = Column(Enum(OpeningType, name="opening_type"), nullable=False)
    width = Column(Integer, nullable=False)
    height = Column(Integer, nullable=False)
    quantity = Column(Integer, nullable=False)
    created_at = Column(DateTime(timezone=True), server_default=func.now(), nullable=False)

    project = relationship("Project", back_populates="openings")

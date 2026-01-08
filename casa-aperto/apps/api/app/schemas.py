from __future__ import annotations

from datetime import datetime

from pydantic import BaseModel, ConfigDict, EmailStr, Field

from app.models import BuildingType, OpeningType, UserRole


class UserBase(BaseModel):
    email: EmailStr
    role: UserRole

    model_config = ConfigDict(from_attributes=True)


class UserOut(UserBase):
    id: int
    created_at: datetime


class UserCreate(BaseModel):
    email: EmailStr
    password: str = Field(min_length=8)
    role: UserRole


class LoginRequest(BaseModel):
    email: EmailStr
    password: str


class ProjectBase(BaseModel):
    name: str = Field(min_length=3, max_length=80)
    building_type: BuildingType


class ProjectCreate(ProjectBase):
    pass


class ProjectOut(ProjectBase):
    id: int
    created_at: datetime

    model_config = ConfigDict(from_attributes=True)


class OpeningBase(BaseModel):
    type: OpeningType
    width: int = Field(ge=300, le=12000)
    height: int = Field(ge=300, le=4000)
    quantity: int = Field(ge=1, le=20)


class OpeningCreate(OpeningBase):
    pass


class OpeningOut(OpeningBase):
    id: int
    created_at: datetime

    model_config = ConfigDict(from_attributes=True)

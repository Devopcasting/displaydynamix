from pydantic import BaseModel, EmailStr
from typing import Optional, Dict, Any
from datetime import datetime


class UserBase(BaseModel):
    username: str
    email: EmailStr
    role: str = "Viewer"
    permissions: Optional[Dict[str, Any]] = {}
    force_password_change: bool = True


class UserCreate(UserBase):
    password: str


class UserUpdate(BaseModel):
    username: Optional[str] = None
    email: Optional[EmailStr] = None
    password: Optional[str] = None
    role: Optional[str] = None
    permissions: Optional[Dict[str, Any]] = None
    is_active: Optional[bool] = None
    force_password_change: Optional[bool] = None


class UserLogin(BaseModel):
    username: str
    password: str


class UserResponse(UserBase):
    id: int
    is_active: bool
    created_at: datetime
    updated_at: Optional[datetime] = None

    class Config:
        from_attributes = True


class Token(BaseModel):
    access_token: str
    token_type: str


class TokenData(BaseModel):
    username: Optional[str] = None


class PasswordChange(BaseModel):
    current_password: str
    new_password: str


# Permission definitions
class Permissions(BaseModel):
    can_create_content: bool = False
    can_edit_content: bool = False
    can_publish_content: bool = False
    can_schedule_content: bool = False
    can_manage_users: bool = False
    can_manage_screens: bool = False
    can_view_analytics: bool = False
    can_manage_settings: bool = False

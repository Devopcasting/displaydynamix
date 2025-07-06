from pydantic import BaseModel
from typing import Optional, List, Dict, Any
from datetime import datetime


class UserResponse(BaseModel):
    id: int
    username: str
    email: str
    role: str

    class Config:
        from_attributes = True


class TemplateBase(BaseModel):
    name: str
    description: Optional[str] = None
    elements: List[Dict[str, Any]]


class TemplateCreate(TemplateBase):
    pass


class TemplateUpdate(BaseModel):
    name: Optional[str] = None
    description: Optional[str] = None
    elements: Optional[List[Dict[str, Any]]] = None


class TemplateResponse(TemplateBase):
    id: int
    created_by: int
    created_at: datetime
    updated_at: Optional[datetime] = None
    user: Optional[UserResponse] = None

    class Config:
        from_attributes = True

from sqlalchemy import Column, Integer, String, Boolean, JSON
from sqlalchemy.sql import func
from sqlalchemy.sql.sqltypes import DateTime
from ..database import Base


class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    username = Column(String, unique=True, index=True, nullable=False)
    email = Column(String, unique=True, index=True, nullable=False)
    hashed_password = Column(String, nullable=False)
    # Admin, Editor, Viewer, Client
    role = Column(String, nullable=False, default="Viewer")
    permissions = Column(JSON, default=dict)  # Store permissions as JSON
    is_active = Column(Boolean, default=True)
    # Force password change on first login
    force_password_change = Column(Boolean, default=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())

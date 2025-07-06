from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List
from ..database import get_db
from ..crud import user as crud_user
from ..schemas.user import UserCreate, UserResponse, UserUpdate
from ..api.auth import get_current_user

router = APIRouter()


def require_admin(current_user=Depends(get_current_user)):
    if current_user.role != "Admin":
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Admin access required"
        )
    return current_user


@router.get("/", response_model=List[UserResponse])
def get_users(
    skip: int = 0,
    limit: int = 100,
    db: Session = Depends(get_db),
    current_user=Depends(require_admin)
):
    """Get all users (Admin only)"""
    users = crud_user.get_users(db, skip=skip, limit=limit)
    return users


@router.get("/active", response_model=List[UserResponse])
def get_active_users(
    db: Session = Depends(get_db),
    current_user=Depends(require_admin)
):
    """Get all active users (Admin only)"""
    users = crud_user.get_active_users(db)
    return users


@router.get("/role/{role}", response_model=List[UserResponse])
def get_users_by_role(
    role: str,
    db: Session = Depends(get_db),
    current_user=Depends(require_admin)
):
    """Get users by role (Admin only)"""
    users = crud_user.get_users_by_role(db, role=role)
    return users


@router.post("/", response_model=UserResponse)
def create_user(
    user: UserCreate,
    db: Session = Depends(get_db),
    current_user=Depends(require_admin)
):
    """Create a new user (Admin only)"""
    # Check if user already exists
    db_user = crud_user.get_user_by_username(db, username=user.username)
    if db_user:
        raise HTTPException(
            status_code=400,
            detail="Username already registered"
        )

    db_user = crud_user.get_user_by_email(db, email=user.email)
    if db_user:
        raise HTTPException(
            status_code=400,
            detail="Email already registered"
        )

    return crud_user.create_user(db=db, user=user)


@router.get("/{user_id}", response_model=UserResponse)
def get_user(
    user_id: int,
    db: Session = Depends(get_db),
    current_user=Depends(require_admin)
):
    """Get a specific user (Admin only)"""
    user = crud_user.get_user(db, user_id=user_id)
    if user is None:
        raise HTTPException(status_code=404, detail="User not found")
    return user


@router.put("/{user_id}", response_model=UserResponse)
def update_user(
    user_id: int,
    user: UserUpdate,
    db: Session = Depends(get_db),
    current_user=Depends(require_admin)
):
    """Update a user (Admin only)"""
    db_user = crud_user.update_user(db, user_id=user_id, user=user)
    if db_user is None:
        raise HTTPException(status_code=404, detail="User not found")
    return db_user


@router.delete("/{user_id}")
def delete_user(
    user_id: int,
    db: Session = Depends(get_db),
    current_user=Depends(require_admin)
):
    """Delete a user (Admin only)"""
    db_user = crud_user.delete_user(db, user_id=user_id)
    if db_user is None:
        raise HTTPException(status_code=404, detail="User not found")
    return {"message": "User deleted successfully"}


@router.post("/{user_id}/deactivate")
def deactivate_user(
    user_id: int,
    db: Session = Depends(get_db),
    current_user=Depends(require_admin)
):
    """Deactivate a user (Admin only)"""
    db_user = crud_user.deactivate_user(db, user_id=user_id)
    if db_user is None:
        raise HTTPException(status_code=404, detail="User not found")
    return {"message": "User deactivated successfully"}


@router.post("/{user_id}/activate")
def activate_user(
    user_id: int,
    db: Session = Depends(get_db),
    current_user=Depends(require_admin)
):
    """Activate a user (Admin only)"""
    db_user = crud_user.activate_user(db, user_id=user_id)
    if db_user is None:
        raise HTTPException(status_code=404, detail="User not found")
    return {"message": "User activated successfully"}

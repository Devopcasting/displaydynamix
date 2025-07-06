from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List
from ..database import get_db
from ..crud import template as crud_template
from ..schemas.template import TemplateCreate, TemplateUpdate, TemplateResponse
from ..api.auth import get_current_user

router = APIRouter()


@router.get("/", response_model=List[TemplateResponse])
def get_templates(
    skip: int = 0,
    limit: int = 100,
    db: Session = Depends(get_db),
    current_user=Depends(get_current_user)
):
    """Get all templates for the current user"""
    templates = crud_template.get_templates_by_user(
        db, user_id=current_user.id, skip=skip, limit=limit)
    return templates


@router.get("/{template_id}", response_model=TemplateResponse)
def get_template(
    template_id: int,
    db: Session = Depends(get_db),
    current_user=Depends(get_current_user)
):
    """Get a specific template by ID"""
    template = crud_template.get_template(db, template_id=template_id)
    if template is None:
        raise HTTPException(status_code=404, detail="Template not found")

    # Check if user owns the template or is admin
    if template.created_by != current_user.id and current_user.role != "Admin":
        raise HTTPException(status_code=403, detail="Not enough permissions")

    return template


@router.post("/", response_model=TemplateResponse)
def create_template(
    template: TemplateCreate,
    db: Session = Depends(get_db),
    current_user=Depends(get_current_user)
):
    """Create a new template"""
    return crud_template.create_template(db=db, template=template, user_id=current_user.id)


@router.put("/{template_id}", response_model=TemplateResponse)
def update_template(
    template_id: int,
    template: TemplateUpdate,
    db: Session = Depends(get_db),
    current_user=Depends(get_current_user)
):
    """Update a template"""
    db_template = crud_template.get_template(db, template_id=template_id)
    if db_template is None:
        raise HTTPException(status_code=404, detail="Template not found")

    # Check if user owns the template or is admin
    if db_template.created_by != current_user.id and current_user.role != "Admin":
        raise HTTPException(status_code=403, detail="Not enough permissions")

    return crud_template.update_template(db=db, template_id=template_id, template=template)


@router.delete("/{template_id}")
def delete_template(
    template_id: int,
    db: Session = Depends(get_db),
    current_user=Depends(get_current_user)
):
    """Delete a template"""
    db_template = crud_template.get_template(db, template_id=template_id)
    if db_template is None:
        raise HTTPException(status_code=404, detail="Template not found")

    # Check if user owns the template or is admin
    if db_template.created_by != current_user.id and current_user.role != "Admin":
        raise HTTPException(status_code=403, detail="Not enough permissions")

    crud_template.delete_template(db=db, template_id=template_id)
    return {"message": "Template deleted successfully"}

from sqlalchemy.orm import Session, joinedload
from ..models.template import Template
from ..schemas.template import TemplateCreate, TemplateUpdate


def get_template(db: Session, template_id: int):
    return db.query(Template).options(joinedload(Template.user)).filter(Template.id == template_id).first()


def get_templates_by_user(db: Session, user_id: int, skip: int = 0, limit: int = 100):
    return db.query(Template).options(joinedload(Template.user)).filter(Template.created_by == user_id).offset(skip).limit(limit).all()


def get_all_templates(db: Session, skip: int = 0, limit: int = 100):
    return db.query(Template).options(joinedload(Template.user)).offset(skip).limit(limit).all()


def create_template(db: Session, template: TemplateCreate, user_id: int):
    db_template = Template(
        name=template.name,
        description=template.description,
        elements=template.elements,
        created_by=user_id
    )
    db.add(db_template)
    db.commit()
    db.refresh(db_template)
    return db_template


def update_template(db: Session, template_id: int, template: TemplateUpdate):
    db_template = get_template(db, template_id)
    if not db_template:
        return None

    update_data = template.dict(exclude_unset=True)
    for field, value in update_data.items():
        setattr(db_template, field, value)

    db.commit()
    db.refresh(db_template)
    return db_template


def delete_template(db: Session, template_id: int):
    db_template = get_template(db, template_id)
    if not db_template:
        return None

    db.delete(db_template)
    db.commit()
    return db_template

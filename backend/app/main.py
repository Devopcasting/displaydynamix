from .api.users import router as users_router
from .api.auth import router as auth_router
from .api.templates import router as templates_router
from .models import user as models
from .models import template as template_models
from .database import engine
from fastapi.middleware.cors import CORSMiddleware
from fastapi import FastAPI
from config import get_config
import sys
import os
from pathlib import Path

# Add the backend directory to the Python path
backend_dir = Path(__file__).parent.parent
sys.path.insert(0, str(backend_dir))


# Get configuration
config = get_config()

# Create database tables
models.Base.metadata.create_all(bind=engine)

app = FastAPI(
    title="Display Dynamix Studio API",
    description="Backend API for Display Dynamix Studio",
    version="1.0.0"
)

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=config.cors_allowed_origins,
    allow_credentials=config.cors_allow_credentials,
    allow_methods=config.cors_allowed_methods,
    allow_headers=config.cors_allowed_headers,
    expose_headers=config.cors_expose_headers,
    max_age=config.cors_max_age,
)

# Include routers
app.include_router(auth_router, prefix="/api/auth", tags=["authentication"])
app.include_router(users_router, prefix="/api/users", tags=["user management"])
app.include_router(
    templates_router, prefix="/api/templates", tags=["templates"])


@app.get("/")
def read_root():
    return {"message": "Display Dynamix Studio API"}


@app.get("/health")
def health_check():
    return {"status": "healthy"}

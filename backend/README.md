# Display Dynamix Studio - Backend API

FastAPI backend for Display Dynamix Studio with SQLAlchemy, SQLite, and bcrypt authentication.

## Features

- FastAPI with automatic API documentation
- SQLAlchemy ORM with SQLite database
- bcrypt password hashing
- JWT token authentication
- CORS support for frontend integration
- Role-based user management (Admin, Editor, Viewer)

## Setup

1. **Install dependencies:**
   ```bash
   pip install -r requirements.txt
   ```

2. **Initialize the database:**
   ```bash
   python init_db.py
   ```

3. **Run the server:**
   ```bash
   python run.py
   ```

The server will start on `http://localhost:8000`

## API Documentation

Once the server is running, you can access:
- **Interactive API docs (Swagger UI):** http://localhost:8000/docs
- **Alternative API docs (ReDoc):** http://localhost:8000/redoc

## Default Users

The initialization script creates these default users:

- **Admin:** username: `admin`, password: `admin`
- **Editor:** username: `editor`, password: `editor`
- **Viewer:** username: `viewer`, password: `viewer`

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register a new user
- `POST /api/auth/login` - Login with username and password
- `POST /api/auth/token` - Get JWT token (OAuth2 compatible)

### Health Check
- `GET /` - Root endpoint
- `GET /health` - Health check endpoint

## Database

The application uses SQLite with the following schema:

### Users Table
- `id` (Primary Key)
- `username` (Unique)
- `email` (Unique)
- `hashed_password`
- `role` (Admin/Editor/Viewer)
- `is_active`
- `created_at`
- `updated_at`

## Security

- Passwords are hashed using bcrypt
- JWT tokens for authentication
- CORS configured for frontend integration
- Input validation using Pydantic schemas 
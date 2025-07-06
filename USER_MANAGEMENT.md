# User Management System

## Overview

The Display Dynamix Studio now includes a comprehensive user management system that allows administrators to create, manage, and control user access with granular permissions.

## Features

### User Roles

The system supports four distinct user roles:

1. **Admin** - Full system access
   - Can manage all users
   - Can access all features
   - Can modify system settings
   - Can view analytics and reports

2. **Editor** - Content creation and editing
   - Can create and edit content
   - Can publish content to screens
   - Can schedule content
   - Can view analytics
   - Cannot manage users or system settings

3. **Viewer** - Read-only access
   - Can view content and screens
   - Cannot create, edit, or publish content
   - Cannot access user management or system settings

4. **Client** - Limited access for clients
   - Can view content and analytics
   - Cannot create or edit content
   - Cannot access administrative features

### Permissions System

Each user has granular permissions that control their access to specific features:

- `can_create_content` - Create new content
- `can_edit_content` - Edit existing content
- `can_publish_content` - Publish content to screens
- `can_schedule_content` - Schedule content
- `can_manage_users` - Manage other users
- `can_manage_screens` - Manage display screens
- `can_view_analytics` - View analytics and reports
- `can_manage_settings` - Manage system settings

## Backend API

### User Management Endpoints

All endpoints require admin authentication.

#### Get All Users
```
GET /api/users/
```

#### Get Active Users
```
GET /api/users/active
```

#### Get Users by Role
```
GET /api/users/role/{role}
```

#### Create User
```
POST /api/users/
Content-Type: application/json

{
  "username": "newuser",
  "email": "user@example.com",
  "password": "password123",
  "role": "Editor",
  "permissions": {
    "can_create_content": true,
    "can_edit_content": true,
    "can_publish_content": false,
    "can_schedule_content": false,
    "can_manage_users": false,
    "can_manage_screens": false,
    "can_view_analytics": true,
    "can_manage_settings": false
  }
}
```

#### Get Specific User
```
GET /api/users/{user_id}
```

#### Update User
```
PUT /api/users/{user_id}
Content-Type: application/json

{
  "username": "updateduser",
  "email": "updated@example.com",
  "role": "Client",
  "permissions": {
    "can_create_content": false,
    "can_edit_content": false,
    "can_publish_content": false,
    "can_schedule_content": false,
    "can_manage_users": false,
    "can_manage_screens": false,
    "can_view_analytics": true,
    "can_manage_settings": false
  }
}
```

#### Delete User
```
DELETE /api/users/{user_id}
```

#### Activate User
```
POST /api/users/{user_id}/activate
```

#### Deactivate User
```
POST /api/users/{user_id}/deactivate
```

## Frontend Interface

### Accessing User Management

1. Log in as an admin user
2. Navigate to Settings (gear icon in sidebar)
3. Click on the "User Management" tab

### Features Available

#### User List
- View all users in the system
- See user roles, status (active/inactive), and creation date
- Color-coded role badges for easy identification

#### Create New User
- Add new users with username, email, and password
- Select role from predefined options
- Configure granular permissions
- Validation for duplicate usernames and emails

#### Edit User
- Modify user information
- Change user role
- Update permissions
- Cannot edit passwords (use separate password change feature)

#### User Status Management
- Activate/deactivate users without deleting them
- Visual indicators for active/inactive status
- Quick toggle buttons for status changes

#### Delete User
- Permanently remove users from the system
- Confirmation dialog to prevent accidental deletion

## Database Schema

### User Model

```python
class User(Base):
    __tablename__ = "users"
    
    id = Column(Integer, primary_key=True, index=True)
    username = Column(String, unique=True, index=True, nullable=False)
    email = Column(String, unique=True, index=True, nullable=False)
    hashed_password = Column(String, nullable=False)
    role = Column(String, nullable=False, default="Viewer")
    permissions = Column(JSON, default=dict)
    is_active = Column(Boolean, default=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())
```

## Setup and Installation

### 1. Update Database Schema

If you have an existing database, run the update script:

```bash
cd backend
python update_database.py
```

### 2. Start the Backend

```bash
cd backend
uvicorn app.main:app --reload --port 8000
```

### 3. Start the Frontend

```bash
npm run dev
```

### 4. Test User Management

Run the test script to verify functionality:

```bash
cd backend
python test_user_management.py
```

## Default Users

The system comes with these default users:

- **admin** / admin123 (Admin role)
- **editor** / editor123 (Editor role)
- **viewer** / viewer123 (Viewer role)

## Security Considerations

1. **Admin-Only Access**: User management is restricted to admin users only
2. **Password Security**: Passwords are hashed using bcrypt
3. **JWT Authentication**: All API calls require valid JWT tokens
4. **Input Validation**: All user inputs are validated on both frontend and backend
5. **SQL Injection Protection**: Using SQLAlchemy ORM prevents SQL injection attacks

## Usage Examples

### Creating a New Editor User

1. Log in as admin
2. Go to Settings > User Management
3. Click "Add User"
4. Fill in the form:
   - Username: `content_editor`
   - Email: `editor@company.com`
   - Password: `secure_password`
   - Role: `Editor`
   - Permissions: Enable content creation and editing permissions
5. Click "Create User"

### Managing User Permissions

1. Find the user in the list
2. Click the edit button
3. Modify the role or individual permissions
4. Save changes

### Deactivating a User

1. Find the user in the list
2. Click the eye/eye-off button to toggle active status
3. Or use the edit dialog to change status

## Troubleshooting

### Common Issues

1. **Permission Denied**: Ensure you're logged in as an admin user
2. **Database Errors**: Run the database update script
3. **API Connection**: Verify the backend is running on port 8000
4. **CORS Issues**: Check that the frontend is running on port 9002

### Logs and Debugging

- Backend logs: Check the terminal where uvicorn is running
- Frontend logs: Check browser developer console
- Database: Check the `displaydynamix.db` file in the backend directory

## Future Enhancements

Potential improvements for the user management system:

1. **Bulk Operations**: Import/export users, bulk role changes
2. **Audit Logging**: Track user management actions
3. **Password Policies**: Enforce password complexity requirements
4. **Two-Factor Authentication**: Add 2FA support
5. **User Groups**: Organize users into groups for easier management
6. **Temporary Access**: Grant temporary elevated permissions
7. **API Rate Limiting**: Prevent abuse of user management endpoints 
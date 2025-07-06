# Configuration System

This document explains how to use the shared configuration system for Display Dynamix Studio.

## Overview

The application uses a shared `config.ini` file that can be accessed by both the frontend (Next.js) and backend (FastAPI) applications. This ensures consistency across the entire system and makes it easy to manage configuration changes.

## Configuration File

The main configuration file is `config.ini` in the project root. It contains all the settings organized into logical sections:

### Server Configuration
```ini
[server]
host = localhost
port = 8000
debug = true
workers = 1
```

### Client Configuration
```ini
[client]
host = localhost
port = 9002
dev_mode = true
```

### API Configuration
```ini
[api]
base_url = http://localhost:8000/api
version = v1
timeout = 30000
```

### CORS Configuration
```ini
[cors]
allowed_origins = http://localhost:9002,http://127.0.0.1:9002
allowed_methods = GET,POST,PUT,DELETE,OPTIONS
allowed_headers = Content-Type,Authorization
allow_credentials = true
```

### Database Configuration
```ini
[database]
type = sqlite
name = displaydynamix.db
path = backend/
backup_enabled = true
backup_interval = 24
```

### Security Configuration
```ini
[security]
jwt_secret = your-super-secret-jwt-key-change-in-production
jwt_algorithm = HS256
jwt_expiration = 3600
password_min_length = 8
bcrypt_rounds = 12
```

### Role Permissions
```ini
[roles]
admin_permissions = can_create_content,can_edit_content,can_publish_content,can_schedule_content,can_manage_users,can_manage_screens,can_view_analytics,can_manage_settings
editor_permissions = can_create_content,can_edit_content,can_publish_content,can_schedule_content,can_view_analytics
viewer_permissions = 
client_permissions = can_view_analytics
```

## Backend Usage (Python)

### Import the Configuration

```python
from config import get_config

# Get the global configuration instance
config = get_config()
```

### Access Configuration Values

```python
# Server configuration
host = config.server_host
port = config.server_port
debug = config.server_debug

# API configuration
base_url = config.api_base_url
timeout = config.api_timeout

# CORS configuration
allowed_origins = config.cors_allowed_origins
allowed_methods = config.cors_allowed_methods

# Security configuration
jwt_secret = config.jwt_secret
jwt_expiration = config.jwt_expiration

# Role permissions
admin_perms = config.admin_permissions
editor_perms = config.editor_permissions
```

### Example: Using Configuration in FastAPI

```python
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from config import get_config

config = get_config()

app = FastAPI(
    title="Display Dynamix Studio API",
    version="1.0.0"
)

# Configure CORS using config values
app.add_middleware(
    CORSMiddleware,
    allow_origins=config.cors_allowed_origins,
    allow_credentials=config.cors_allow_credentials,
    allow_methods=config.cors_allowed_methods,
    allow_headers=config.cors_allowed_headers,
)
```

## Frontend Usage (TypeScript/React)

### Import the Configuration

```typescript
import { config, apiBaseUrl, corsAllowedOrigins } from '@/lib/config';
```

### Access Configuration Values

```typescript
// API configuration
const baseUrl = config.apiBaseUrl;
const timeout = config.apiTimeout;

// Client configuration
const clientPort = config.clientPort;
const devMode = config.clientDevMode;

// Feature flags
const userManagementEnabled = config.featureUserManagement;
const analyticsEnabled = config.featureAnalytics;

// Role permissions
const adminPerms = config.adminPermissions;
const editorPerms = config.editorPermissions;

// Utility methods
const hasPermission = config.hasPermission('Admin', 'can_manage_users');
const apiUrl = config.getApiUrl('users');
const isDev = config.isDevelopment();
```

### Example: Using Configuration in React Components

```typescript
import { config, apiBaseUrl } from '@/lib/config';

export default function MyComponent() {
  const fetchData = async () => {
    const response = await fetch(`${apiBaseUrl}/users`, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });
    // ... handle response
  };

  return (
    <div>
      {config.isDevelopment() && (
        <div className="debug-info">
          API URL: {apiBaseUrl}
        </div>
      )}
      {/* Component content */}
    </div>
  );
}
```

### Example: Role-Based Access Control

```typescript
import { config } from '@/lib/config';

export function ProtectedComponent({ user, children }) {
  const canManageUsers = config.hasPermission(user.role, 'can_manage_users');
  
  if (!canManageUsers) {
    return <div>Access denied</div>;
  }
  
  return <div>{children}</div>;
}
```

## Environment-Specific Configuration

### Development Environment

For development, you can modify the `config.ini` file:

```ini
[development]
auto_reload = true
show_debug_info = true
mock_data = false
test_mode = false
```

### Production Environment

For production, create a `config.prod.ini` file:

```ini
[server]
host = 0.0.0.0
port = 8000
debug = false
workers = 4

[security]
jwt_secret = your-production-secret-key
jwt_expiration = 86400

[development]
auto_reload = false
show_debug_info = false
mock_data = false
test_mode = false
```

## Configuration Validation

The configuration system includes validation and fallback values:

### Backend Validation

```python
from config import get_config

config = get_config()

# These will use fallback values if not found in config.ini
host = config.server_host  # defaults to 'localhost'
port = config.server_port  # defaults to 8000
debug = config.server_debug  # defaults to True
```

### Frontend Validation

```typescript
import { config } from '@/lib/config';

// The config manager provides fallback values
const baseUrl = config.apiBaseUrl; // defaults to 'http://localhost:8000/api'
const timeout = config.apiTimeout; // defaults to 30000
```

## Best Practices

### 1. Use Configuration for All External Dependencies

Instead of hardcoding values:

```typescript
// ❌ Bad
const API_URL = "http://localhost:8000/api";

// ✅ Good
import { apiBaseUrl } from '@/lib/config';
const API_URL = apiBaseUrl;
```

### 2. Use Feature Flags

```typescript
// ✅ Good
if (config.featureUserManagement) {
  // Show user management features
}
```

### 3. Use Role-Based Permissions

```typescript
// ✅ Good
const canEdit = config.hasPermission(user.role, 'can_edit_content');
```

### 4. Environment-Specific Settings

```typescript
// ✅ Good
if (config.isDevelopment()) {
  console.log('Debug info:', config.apiBaseUrl);
}
```

## Adding New Configuration Options

### 1. Add to config.ini

```ini
[new_section]
new_option = value
another_option = 123
boolean_option = true
list_option = item1,item2,item3
```

### 2. Add to Backend Config Class

```python
# In backend/config.py
@property
def new_option(self) -> str:
    return self.get('new_section', 'new_option', 'default_value')

@property
def another_option(self) -> int:
    return self.getint('new_section', 'another_option', 0)

@property
def boolean_option(self) -> bool:
    return self.getboolean('new_section', 'boolean_option', False)

@property
def list_option(self) -> List[str]:
    return self.getlist('new_section', 'list_option', [])
```

### 3. Add to Frontend Config Interface

```typescript
// In src/lib/config.ts
export interface ConfigData {
  // ... existing sections
  new_section: {
    new_option: string;
    another_option: number;
    boolean_option: boolean;
    list_option: string[];
  };
}

// Add getters
public get newOption(): string {
  return this.getConfig().new_section.new_option;
}

public get anotherOption(): number {
  return this.getConfig().new_section.another_option;
}

public get booleanOption(): boolean {
  return this.getConfig().new_section.boolean_option;
}

public get listOption(): string[] {
  return this.getConfig().new_section.list_option;
}
```

## Troubleshooting

### Configuration File Not Found

If you get a "Configuration file not found" error:

1. Ensure `config.ini` exists in the project root
2. Check that the backend is running from the correct directory
3. Verify file permissions

### Configuration Values Not Updating

1. Restart the backend server after changing `config.ini`
2. Clear browser cache for frontend changes
3. Use `reload_config()` in Python to force reload

### Type Errors in Frontend

1. Update the `ConfigData` interface when adding new options
2. Ensure all getters return the correct types
3. Use proper TypeScript types for all configuration values

## Security Considerations

1. **Never commit sensitive values** like JWT secrets to version control
2. **Use environment variables** for production secrets
3. **Validate configuration values** before using them
4. **Use different config files** for different environments

Example of using environment variables:

```python
# In backend/config.py
import os

@property
def jwt_secret(self) -> str:
    # Use environment variable if available, otherwise use config file
    return os.getenv('JWT_SECRET') or self.get('security', 'jwt_secret', 'default-secret')
``` 
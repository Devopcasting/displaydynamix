# CORS Configuration for Display Dynamix Studio

This document explains the Cross-Origin Resource Sharing (CORS) configuration for both the backend (FastAPI) and frontend (Next.js) applications.

## Overview

CORS is configured to allow secure communication between the frontend and backend applications, as well as any external services that need to access the API.

## Backend CORS Configuration (FastAPI)

### Configuration File (`config.ini`)

The CORS settings are defined in the `[cors]` section of `config.ini`:

```ini
[cors]
# CORS configuration
allowed_origins = http://localhost:9002,http://127.0.0.1:9002,http://localhost:3000,http://127.0.0.1:3000
allowed_methods = GET,POST,PUT,DELETE,OPTIONS,PATCH
allowed_headers = Content-Type,Authorization,X-Requested-With,Accept,Origin,Access-Control-Request-Method,Access-Control-Request-Headers
allow_credentials = true
expose_headers = Content-Disposition,Content-Length,Content-Type
max_age = 86400
```

### Implementation (`backend/app/main.py`)

The CORS middleware is configured using FastAPI's `CORSMiddleware`:

```python
from fastapi.middleware.cors import CORSMiddleware
from config import get_config

config = get_config()

app.add_middleware(
    CORSMiddleware,
    allow_origins=config.cors_allowed_origins,
    allow_credentials=config.cors_allow_credentials,
    allow_methods=config.cors_allowed_methods,
    allow_headers=config.cors_allowed_headers,
    expose_headers=config.cors_expose_headers,
    max_age=config.cors_max_age,
)
```

### Configuration Properties (`backend/config.py`)

The configuration class provides properties for accessing CORS settings:

```python
@property
def cors_allowed_origins(self) -> List[str]:
    return self.getlist('cors', 'allowed_origins', ['http://localhost:9002'])

@property
def cors_allowed_methods(self) -> List[str]:
    return self.getlist('cors', 'allowed_methods', ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'])

@property
def cors_allowed_headers(self) -> List[str]:
    return self.getlist('cors', 'allowed_headers', ['Content-Type', 'Authorization', ...])

@property
def cors_allow_credentials(self) -> bool:
    return self.getboolean('cors', 'allow_credentials', True)

@property
def cors_expose_headers(self) -> List[str]:
    return self.getlist('cors', 'expose_headers', ['Content-Disposition', 'Content-Length', 'Content-Type'])

@property
def cors_max_age(self) -> int:
    return self.getint('cors', 'max_age', 86400)
```

## Frontend CORS Configuration (Next.js)

### Configuration (`src/lib/config.ts`)

CORS settings are defined as constants and can be overridden by environment variables:

```typescript
// CORS Configuration
export const corsAllowedOrigins = process.env.NEXT_PUBLIC_CORS_ALLOWED_ORIGINS?.split(',') || [
  'http://localhost:9002',
  'http://127.0.0.1:9002',
  'http://localhost:3000',
  'http://127.0.0.1:3000'
];

export const corsAllowedMethods = process.env.NEXT_PUBLIC_CORS_ALLOWED_METHODS?.split(',') || [
  'GET', 'POST', 'PUT', 'DELETE', 'OPTIONS', 'PATCH'
];

export const corsAllowedHeaders = process.env.NEXT_PUBLIC_CORS_ALLOWED_HEADERS?.split(',') || [
  'Content-Type', 'Authorization', 'X-Requested-With', 'Accept', 'Origin', 
  'Access-Control-Request-Method', 'Access-Control-Request-Headers'
];

export const corsAllowCredentials = process.env.NEXT_PUBLIC_CORS_ALLOW_CREDENTIALS !== 'false';
```

### Middleware (`src/middleware.ts`)

Next.js middleware handles CORS for all API routes:

```typescript
export function middleware(request: NextRequest) {
  const origin = request.headers.get('origin');
  const method = request.method;

  // Handle CORS for API routes
  if (request.nextUrl.pathname.startsWith('/api/')) {
    // Handle preflight requests
    if (method === 'OPTIONS') {
      const response = new NextResponse(null, { status: 200 });
      
      if (origin && isOriginAllowed(origin)) {
        response.headers.set('Access-Control-Allow-Origin', origin);
      }
      
      response.headers.set('Access-Control-Allow-Methods', corsAllowedMethods.join(','));
      response.headers.set('Access-Control-Allow-Headers', corsAllowedHeaders.join(','));
      
      if (corsAllowCredentials) {
        response.headers.set('Access-Control-Allow-Credentials', 'true');
      }
      
      response.headers.set('Access-Control-Max-Age', '86400');
      
      return response;
    }

    // Handle actual API requests
    const response = NextResponse.next();
    
    if (origin && isOriginAllowed(origin)) {
      response.headers.set('Access-Control-Allow-Origin', origin);
    }
    
    if (corsAllowCredentials) {
      response.headers.set('Access-Control-Allow-Credentials', 'true');
    }
    
    return response;
  }

  return NextResponse.next();
}
```

### Next.js Configuration (`next.config.ts`)

Static CORS headers are configured in the Next.js config:

```typescript
async headers() {
  return [
    {
      // Apply CORS headers to API routes
      source: '/api/(.*)',
      headers: [
        {
          key: 'Access-Control-Allow-Origin',
          value: process.env.NEXT_PUBLIC_CORS_ALLOWED_ORIGINS || 'http://localhost:9002,http://127.0.0.1:9002,http://localhost:3000,http://127.0.0.1:3000',
        },
        {
          key: 'Access-Control-Allow-Methods',
          value: 'GET, POST, PUT, DELETE, OPTIONS, PATCH',
        },
        {
          key: 'Access-Control-Allow-Headers',
          value: 'Content-Type, Authorization, X-Requested-With, Accept, Origin, Access-Control-Request-Method, Access-Control-Request-Headers',
        },
        {
          key: 'Access-Control-Allow-Credentials',
          value: 'true',
        },
      ],
    },
  ];
},
```

### CORS Utility (`src/lib/cors.ts`)

A utility module provides CORS middleware for individual API routes:

```typescript
export function withCors(handler: Function, options: CorsOptions = {}) {
  return async function(request: NextRequest) {
    const corsHandler = corsMiddleware(options);
    const corsResponse = corsHandler(request);
    
    if (corsResponse) {
      return corsResponse;
    }
    
    return handler(request);
  };
}
```

### API Client (`src/lib/api-client.ts`)

A configured API client that handles CORS headers automatically:

```typescript
export class ApiClient {
  constructor(options: ApiClientOptions = {}) {
    this.baseURL = options.baseURL || config.apiBaseUrl;
    this.timeout = options.timeout || config.apiTimeout;
    this.defaultHeaders = {
      ...config.getCorsHeaders(),
      ...options.headers,
    };
  }
  
  // ... rest of implementation
}
```

## Environment Variables

You can override CORS settings using environment variables:

### Frontend Environment Variables

```bash
# .env.local
NEXT_PUBLIC_CORS_ALLOWED_ORIGINS=http://localhost:3000,http://localhost:9002
NEXT_PUBLIC_CORS_ALLOWED_METHODS=GET,POST,PUT,DELETE,OPTIONS,PATCH
NEXT_PUBLIC_CORS_ALLOWED_HEADERS=Content-Type,Authorization,X-Requested-With,Accept,Origin
NEXT_PUBLIC_CORS_ALLOW_CREDENTIALS=true
```

### Backend Environment Variables

The backend uses the `config.ini` file, but you can modify it or create environment-specific versions.

## Usage Examples

### Making API Calls from Frontend

```typescript
import { api } from '@/lib/api-client';

// Simple GET request
const response = await api.get('users');

// POST request with data
const response = await api.post('templates', {
  name: 'My Template',
  description: 'A new template'
});

// With authentication
api.setAuthToken('your-jwt-token');
const response = await api.get('protected-endpoint');
```

### Using CORS Middleware in API Routes

```typescript
import { withCors } from '@/lib/cors';

async function handleRequest(request: NextRequest) {
  // Your API logic here
  return NextResponse.json({ message: 'Success' });
}

export const GET = withCors(handleRequest);
export const POST = withCors(handleRequest);
```

### Custom CORS Options

```typescript
export const GET = withCors(handleRequest, {
  origin: ['https://myapp.com', 'https://admin.myapp.com'],
  methods: ['GET', 'POST'],
  credentials: true
});
```

## Security Considerations

1. **Origin Validation**: Only allow trusted origins in production
2. **Credentials**: Be careful with `allow_credentials: true` in production
3. **Headers**: Only expose necessary headers
4. **Methods**: Only allow required HTTP methods
5. **Max Age**: Set appropriate cache duration for preflight requests

## Production Configuration

For production, update the `config.ini` file:

```ini
[cors]
allowed_origins = https://yourdomain.com,https://admin.yourdomain.com
allowed_methods = GET,POST,PUT,DELETE,OPTIONS
allowed_headers = Content-Type,Authorization
allow_credentials = true
expose_headers = Content-Disposition,Content-Length,Content-Type
max_age = 86400
```

## Testing CORS

You can test CORS configuration using:

1. **Browser Developer Tools**: Check Network tab for CORS errors
2. **curl**: Test preflight requests
3. **Postman**: Test API endpoints with different origins

### Example curl test:

```bash
# Test preflight request
curl -X OPTIONS \
  -H "Origin: http://localhost:3000" \
  -H "Access-Control-Request-Method: POST" \
  -H "Access-Control-Request-Headers: Content-Type,Authorization" \
  http://localhost:8000/api/auth/login

# Test actual request
curl -X POST \
  -H "Origin: http://localhost:3000" \
  -H "Content-Type: application/json" \
  -d '{"username":"test","password":"test"}' \
  http://localhost:8000/api/auth/login
```

## Troubleshooting

### Common CORS Issues

1. **Missing Origin**: Ensure the origin is included in `allowed_origins`
2. **Missing Headers**: Add required headers to `allowed_headers`
3. **Credentials**: Set `allow_credentials` to `true` if using cookies/auth
4. **Preflight**: Ensure OPTIONS method is allowed
5. **Cache**: Clear browser cache if CORS settings changed

### Debug Mode

Enable debug logging in the backend:

```python
# In backend/app/main.py
import logging
logging.basicConfig(level=logging.DEBUG)
```

This will log CORS-related information to help debug issues. 
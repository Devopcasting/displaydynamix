# Display Dynamix Studio

A full-stack digital signage studio application with Next.js frontend and FastAPI backend.

## 🏗️ Architecture

- **Frontend**: Next.js 15 with TypeScript, Tailwind CSS, and shadcn/ui
- **Backend**: FastAPI with SQLAlchemy, SQLite, and bcrypt authentication
- **Database**: SQLite with encrypted passwords
- **Authentication**: JWT tokens with role-based access control

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ and npm
- Python 3.8+ and pip

### 1. Frontend Setup
```bash
# Install dependencies
npm install

# Start the development server
npm run dev
```

Frontend will be available at: http://localhost:9002

### 2. Backend Setup
```bash
# Navigate to backend directory
cd backend

# Install Python dependencies
pip install -r requirements.txt

# Initialize database with default users
python init_db.py

# Start the FastAPI server
python run.py
```

Backend will be available at: http://localhost:8000

### 3. API Documentation
Once the backend is running, visit:
- **Swagger UI**: http://localhost:8000/docs
- **ReDoc**: http://localhost:8000/redoc

## 👥 Default Users

The system comes with three pre-configured users:

| Username | Password | Role | Permissions |
|----------|----------|------|-------------|
| `admin` | `admin` | Admin | Full access to all features |
| `editor` | `editor` | Editor | Content creation and editing |
| `viewer` | `viewer` | Viewer | Read-only access |

## 🎨 Frontend Features

### Core Functionality
- **Drag-and-Drop Editor**: Visual canvas editor with multiple element types
- **Media Library**: Asset management for images and videos
- **Playlist Management**: Create and manage content playlists
- **Screen Management**: Register and monitor display screens
- **Scheduling System**: Calendar-based content scheduling
- **Role-Based Access**: Different permissions for Admin, Editor, and Viewer

### Element Types
- Text, Images, Videos, Shapes
- Weather widgets, RSS feeds, Clocks
- Webpages, QR codes, Marquee text

### UI/UX
- Modern, responsive design with Tailwind CSS
- Light theme (fixed)
- Role-based navigation
- Real-time preview functionality

## 🔧 Backend Features

### Authentication & Security
- JWT token-based authentication
- bcrypt password hashing
- Role-based access control
- CORS support for frontend integration

### API Endpoints
- `POST /api/auth/login` - User authentication
- `POST /api/auth/register` - User registration
- `GET /api/auth/me` - Get current user info
- `POST /api/auth/token` - OAuth2 compatible token endpoint

### Database
- SQLite with SQLAlchemy ORM
- User management with encrypted passwords
- Audit trails with timestamps

## 📁 Project Structure

```
displaydynamix/
├── src/                    # Frontend (Next.js)
│   ├── app/               # App Router pages
│   ├── components/        # React components
│   ├── hooks/            # Custom hooks
│   └── lib/              # Utilities
├── backend/               # Backend (FastAPI)
│   ├── app/              # FastAPI application
│   │   ├── api/          # API endpoints
│   │   ├── auth/         # Authentication
│   │   ├── crud/         # Database operations
│   │   ├── models/       # SQLAlchemy models
│   │   └── schemas/      # Pydantic schemas
│   ├── init_db.py        # Database initialization
│   └── run.py            # Server runner
└── docs/                 # Documentation
```

## 🔐 Security Features

- **Password Security**: bcrypt hashing with salt
- **Token Authentication**: JWT tokens with expiration
- **CORS Protection**: Configured for frontend integration
- **Input Validation**: Pydantic schemas for data validation
- **Role-Based Access**: Granular permissions system

## 🧪 Testing

### Backend API Testing
```bash
cd backend
python test_api.py
```

This will test:
- Health endpoint
- Authentication for all users
- User data retrieval

## 🚀 Deployment

### Frontend
- Build: `npm run build`
- Start: `npm start`

### Backend
- Production: Use uvicorn with proper WSGI server
- Environment variables for production settings
- Database migration with Alembic (if needed)

## 📝 Development

### Frontend Development
- Hot reloading with Turbopack
- TypeScript for type safety
- ESLint for code quality

### Backend Development
- Auto-reload with uvicorn
- Automatic API documentation
- SQLAlchemy for database operations

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License.

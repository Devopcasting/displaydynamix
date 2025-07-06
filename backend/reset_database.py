#!/usr/bin/env python3
"""
Database reset script to clean the database and create default admin user.
This script will:
1. Drop all existing tables
2. Recreate all tables
3. Create a default admin user with password 'admin123'
"""

import warnings
from passlib.context import CryptContext
from sqlalchemy import create_engine, text, inspect
import sys
import os
from pathlib import Path

# Add the backend directory to the Python path
backend_dir = Path(__file__).parent
sys.path.insert(0, str(backend_dir))


# Suppress bcrypt warnings
warnings.filterwarnings("ignore", category=UserWarning)
warnings.filterwarnings("ignore", message=".*bcrypt.*")
warnings.filterwarnings("ignore", message=".*trapped.*")

# Password hashing context
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")


def reset_database():
    """Reset database and create default admin user"""

    # Create engine using the same database URL as the main application
    SQLALCHEMY_DATABASE_URL = "sqlite:///./displaydynamix.db"
    engine = create_engine(SQLALCHEMY_DATABASE_URL, connect_args={
                           "check_same_thread": False})

    try:
        print("🔄 Resetting database...")

        with engine.connect() as connection:
            # Get all table names
            inspector = inspect(engine)
            tables = inspector.get_table_names()

            # Drop all tables if they exist
            if tables:
                print(f"🗑️  Dropping {len(tables)} existing tables...")
                for table in tables:
                    connection.execute(text(f"DROP TABLE IF EXISTS {table}"))
                    print(f"   - Dropped table: {table}")
                connection.commit()

            print("✅ All existing tables dropped.")

            # Create users table
            print("🔄 Creating users table...")
            connection.execute(text("""
                CREATE TABLE users (
                    id INTEGER PRIMARY KEY AUTOINCREMENT,
                    username VARCHAR UNIQUE NOT NULL,
                    email VARCHAR UNIQUE NOT NULL,
                    hashed_password VARCHAR NOT NULL,
                    role VARCHAR NOT NULL DEFAULT 'Viewer',
                    permissions TEXT,
                    is_active BOOLEAN DEFAULT TRUE,
                    force_password_change BOOLEAN DEFAULT TRUE,
                    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
                    updated_at DATETIME
                )
            """))

            # Create templates table
            print("🔄 Creating templates table...")
            connection.execute(text("""
                CREATE TABLE templates (
                    id INTEGER PRIMARY KEY AUTOINCREMENT,
                    name VARCHAR NOT NULL,
                    description TEXT,
                    elements JSON NOT NULL,
                    created_by INTEGER NOT NULL,
                    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
                    updated_at DATETIME,
                    FOREIGN KEY (created_by) REFERENCES users (id)
                )
            """))

            # Create indexes
            print("🔄 Creating indexes...")
            connection.execute(
                text("CREATE INDEX ix_users_username ON users (username)"))
            connection.execute(
                text("CREATE INDEX ix_users_email ON users (email)"))
            connection.execute(
                text("CREATE INDEX ix_templates_name ON templates (name)"))
            connection.execute(
                text("CREATE INDEX ix_templates_created_by ON templates (created_by)"))

            connection.commit()
            print("✅ All tables and indexes created.")

            # Create default admin user
            print("🔄 Creating default admin user...")

            # Hash the password
            stderr_backup = sys.stderr
            sys.stderr = open(os.devnull, 'w')
            try:
                hashed_password = pwd_context.hash("admin123")
            finally:
                sys.stderr.close()
                sys.stderr = stderr_backup

            # Insert admin user
            connection.execute(text("""
                INSERT INTO users (
                    username, 
                    email, 
                    hashed_password, 
                    role, 
                    permissions, 
                    is_active, 
                    force_password_change
                ) VALUES (
                    'admin',
                    'admin@dynamixstudio.co',
                    :hashed_password,
                    'Admin',
                    '{"can_create_content": true, "can_edit_content": true, "can_publish_content": true, "can_schedule_content": true, "can_manage_users": true, "can_manage_screens": true, "can_view_analytics": true, "can_manage_settings": true}',
                    TRUE,
                    FALSE
                )
            """), {"hashed_password": hashed_password})

            connection.commit()
            print("✅ Default admin user created successfully!")

            # Verify the setup
            print("🔍 Verifying database setup...")

            # Check tables
            inspector = inspect(engine)
            tables = inspector.get_table_names()
            print(f"   Tables created: {len(tables)}")
            for table in tables:
                print(f"     - {table}")

            # Check admin user
            result = connection.execute(text(
                "SELECT id, username, email, role, is_active FROM users WHERE username = 'admin'"))
            admin_user = result.fetchone()

            if admin_user:
                print(
                    f"   Admin user: {admin_user[1]} ({admin_user[3]}) - Active: {admin_user[4]}")
                print(f"   Admin email: {admin_user[2]}")
                print(f"   Admin ID: {admin_user[0]}")
            else:
                print("❌ Admin user not found!")
                return False

            # Check user count
            result = connection.execute(text("SELECT COUNT(*) FROM users"))
            user_count = result.fetchone()[0]
            print(f"   Total users: {user_count}")

            print("✅ Database verification successful!")

    except Exception as e:
        print(f"❌ Error resetting database: {e}")
        return False

    return True


def show_credentials():
    """Display the default credentials"""
    print("\n" + "=" * 50)
    print("🎉 DATABASE RESET COMPLETED SUCCESSFULLY!")
    print("=" * 50)
    print("\n📋 Default Admin Credentials:")
    print("   Username: admin")
    print("   Password: admin123")
    print("   Email: admin@dynamixstudio.co")
    print("   Role: Admin")
    print("\n🔐 You can now log in with these credentials.")
    print("⚠️  Remember to change the password after first login!")
    print("\n" + "=" * 50)


if __name__ == "__main__":
    print("🚀 Starting database reset...")
    print("⚠️  WARNING: This will delete ALL existing data!")
    print("=" * 50)

    # Ask for confirmation
    response = input("Are you sure you want to reset the database? (yes/no): ")
    if response.lower() not in ['yes', 'y']:
        print("❌ Database reset cancelled.")
        sys.exit(0)

    # Reset the database
    if reset_database():
        show_credentials()
    else:
        print("\n❌ Database reset failed!")
        sys.exit(1)

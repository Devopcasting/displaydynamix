#!/usr/bin/env python3
"""
Database update script to add force_password_change column to existing users.
This script safely adds the new column without affecting existing data.
"""

from sqlalchemy import create_engine, text, inspect
import sys
import os
from pathlib import Path

# Add the backend directory to the Python path
backend_dir = Path(__file__).parent
sys.path.insert(0, str(backend_dir))


def update_database():
    """Update database to add force_password_change column"""

    # Create engine using the same database URL as the main application
    SQLALCHEMY_DATABASE_URL = "sqlite:///./displaydynamix.db"
    engine = create_engine(SQLALCHEMY_DATABASE_URL, connect_args={
                           "check_same_thread": False})

    # Create inspector to check existing columns
    inspector = inspect(engine)

    try:
        # Check if force_password_change column already exists
        columns = inspector.get_columns('users')
        column_names = [col['name'] for col in columns]

        if 'force_password_change' in column_names:
            print("✅ force_password_change column already exists!")
            return True

        print("🔄 Adding force_password_change column to users table...")

        # Add the new column with default value True
        with engine.connect() as connection:
            # Add the column
            connection.execute(text("""
                ALTER TABLE users 
                ADD COLUMN force_password_change BOOLEAN DEFAULT TRUE
            """))

            # Update existing users to have force_password_change = True
            connection.execute(text("""
                UPDATE users 
                SET force_password_change = TRUE 
                WHERE force_password_change IS NULL
            """))

            connection.commit()

        print("✅ Successfully added force_password_change column!")
        print(
            "✅ All existing users have been set to require password change on next login.")

        # Verify the column was added
        columns = inspector.get_columns('users')
        column_names = [col['name'] for col in columns]

        if 'force_password_change' in column_names:
            print("✅ Verification successful: force_password_change column exists!")
        else:
            print("❌ Error: force_password_change column was not added properly!")

    except Exception as e:
        print(f"❌ Error updating database: {e}")
        return False

    return True


def verify_database():
    """Verify that the database is properly updated"""

    # Create engine using the same database URL as the main application
    SQLALCHEMY_DATABASE_URL = "sqlite:///./displaydynamix.db"
    engine = create_engine(SQLALCHEMY_DATABASE_URL, connect_args={
                           "check_same_thread": False})

    try:
        with engine.connect() as connection:
            # For SQLite, we need to use PRAGMA to get table info
            result = connection.execute(text("PRAGMA table_info(users)"))
            columns = result.fetchall()

            # Find the force_password_change column
            force_change_column = None
            for col in columns:
                if col[1] == 'force_password_change':  # col[1] is the column name
                    force_change_column = col
                    break

            if force_change_column:
                print("✅ Database verification successful!")
                print(f"   Column: {force_change_column[1]}")
                print(f"   Type: {force_change_column[2]}")
                print(f"   Not Null: {force_change_column[3]}")
                print(f"   Default: {force_change_column[4]}")

                # Check user count
                result = connection.execute(text("SELECT COUNT(*) FROM users"))
                user_count = result.fetchone()[0]
                print(f"   Total users: {user_count}")

                # Check users with force_password_change = 1 (True in SQLite)
                result = connection.execute(
                    text("SELECT COUNT(*) FROM users WHERE force_password_change = 1"))
                force_change_count = result.fetchone()[0]
                print(
                    f"   Users requiring password change: {force_change_count}")

            else:
                print("❌ force_password_change column not found!")
                return False

    except Exception as e:
        print(f"❌ Error verifying database: {e}")
        return False

    return True


if __name__ == "__main__":
    print("🚀 Starting database update...")
    print("=" * 50)

    # Update the database
    if update_database():
        print("\n🔍 Verifying database update...")
        print("=" * 50)

        if verify_database():
            print("\n🎉 Database update completed successfully!")
            print("\n📋 Summary:")
            print("   - force_password_change column added to users table")
            print(
                "   - All existing users will be prompted to change password on next login")
            print("   - New users will automatically have force_password_change = True")
        else:
            print("\n❌ Database verification failed!")
            sys.exit(1)
    else:
        print("\n❌ Database update failed!")
        sys.exit(1)

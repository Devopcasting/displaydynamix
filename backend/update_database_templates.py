#!/usr/bin/env python3
"""
Database update script to add template tables.
This script safely adds the new template tables without affecting existing data.
"""

from sqlalchemy import create_engine, text, inspect
import sys
from pathlib import Path

# Add the backend directory to the Python path
backend_dir = Path(__file__).parent
sys.path.insert(0, str(backend_dir))


def update_database():
    """Update database to add template tables"""

    # Create engine using the same database URL as the main application
    SQLALCHEMY_DATABASE_URL = "sqlite:///./displaydynamix.db"
    engine = create_engine(SQLALCHEMY_DATABASE_URL, connect_args={
                           "check_same_thread": False})

    # Create inspector to check existing tables
    inspector = inspect(engine)

    try:
        # Check if templates table already exists
        existing_tables = inspector.get_table_names()

        if 'templates' in existing_tables:
            print("✅ templates table already exists!")
            return True

        print("🔄 Creating templates table...")

        # Create the templates table
        with engine.connect() as connection:
            # Create templates table
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

            # Create index on name for faster lookups
            connection.execute(text("""
                CREATE INDEX ix_templates_name ON templates (name)
            """))

            # Create index on created_by for user-specific queries
            connection.execute(text("""
                CREATE INDEX ix_templates_created_by ON templates (created_by)
            """))

            connection.commit()

        print("✅ Successfully created templates table!")
        print("✅ Created indexes for better performance.")

        # Verify the table was created
        existing_tables = inspector.get_table_names()

        if 'templates' in existing_tables:
            print("✅ Verification successful: templates table exists!")

            # Show table structure
            columns = inspector.get_columns('templates')
            print("\n📋 Table structure:")
            for col in columns:
                print(f"   - {col['name']}: {col['type']}")
        else:
            print("❌ Error: templates table was not created properly!")
            return False

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
            # Check if the table exists
            result = connection.execute(text("PRAGMA table_info(templates)"))
            columns = result.fetchall()

            if columns:
                print("✅ Database verification successful!")
                print(f"   Table: templates")
                print(f"   Columns: {len(columns)}")

                # Show column details
                for col in columns:
                    print(f"     - {col[1]} ({col[2]})")

                # Check if there are any templates
                result = connection.execute(
                    text("SELECT COUNT(*) FROM templates"))
                template_count = result.fetchone()[0]
                print(f"   Templates: {template_count}")

            else:
                print("❌ templates table not found!")
                return False

    except Exception as e:
        print(f"❌ Error verifying database: {e}")
        return False

    return True


if __name__ == "__main__":
    print("🚀 Starting template database update...")
    print("=" * 50)

    # Update the database
    if update_database():
        print("\n🔍 Verifying database update...")
        print("=" * 50)

        if verify_database():
            print("\n🎉 Template database update completed successfully!")
            print("\n📋 Summary:")
            print("   - templates table added to database")
            print("   - Indexes created for better performance")
            print("   - Foreign key relationship with users table")
            print("   - Ready for template saving functionality")
        else:
            print("\n❌ Database verification failed!")
            sys.exit(1)
    else:
        print("\n❌ Database update failed!")
        sys.exit(1)

#!/usr/bin/env python3
"""
Script to reset admin password for testing purposes.
"""

import warnings
from passlib.context import CryptContext
from sqlalchemy import create_engine, text
import sys
from pathlib import Path

# Add the backend directory to the Python path
backend_dir = Path(__file__).parent
sys.path.insert(0, str(backend_dir))


# Password hashing context - suppress bcrypt version warnings
warnings.filterwarnings("ignore", category=UserWarning)
warnings.filterwarnings("ignore", message=".*bcrypt.*")
warnings.filterwarnings("ignore", message=".*trapped.*")
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")


def reset_admin_password():
    """Reset admin password to 'admin123'"""

    # New password
    new_password = "admin123"

    # Suppress bcrypt warnings by redirecting stderr temporarily
    import os
    import sys
    stderr_backup = sys.stderr
    sys.stderr = open(os.devnull, 'w')

    try:
        hashed_password = pwd_context.hash(new_password)
    finally:
        sys.stderr.close()
        sys.stderr = stderr_backup

    # Create engine
    SQLALCHEMY_DATABASE_URL = "sqlite:///./displaydynamix.db"
    engine = create_engine(SQLALCHEMY_DATABASE_URL, connect_args={
                           "check_same_thread": False})

    try:
        with engine.connect() as connection:
            # Update admin password
            connection.execute(text("""
                UPDATE users 
                SET hashed_password = :hashed_password 
                WHERE username = 'admin'
            """), {"hashed_password": hashed_password})

            connection.commit()

            print("✅ Admin password reset successfully!")
            print(f"   Username: admin")
            print(f"   New password: {new_password}")
            print("\n📝 You can now log in with these credentials.")

    except Exception as e:
        print(f"❌ Error resetting password: {e}")
        return False

    return True


if __name__ == "__main__":
    print("🔐 Resetting admin password...")
    print("=" * 40)

    if reset_admin_password():
        print("\n🎉 Password reset completed!")
    else:
        print("\n❌ Password reset failed!")
        sys.exit(1)

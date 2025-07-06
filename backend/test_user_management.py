#!/usr/bin/env python3
"""
Test script for user management functionality
"""

import requests
import json

BASE_URL = "http://localhost:8000/api"


def login_admin():
    """Login as admin and return token"""
    response = requests.post(f"{BASE_URL}/auth/login", json={
        "username": "admin",
        "password": "admin123"
    })

    if response.status_code == 200:
        return response.json()["access_token"]
    else:
        print(f"Login failed: {response.status_code}")
        return None


def test_user_management():
    """Test user management endpoints"""
    token = login_admin()
    if not token:
        print("Failed to login as admin")
        return

    headers = {
        "Authorization": f"Bearer {token}",
        "Content-Type": "application/json"
    }

    print("Testing User Management API...")

    # Test 1: Get all users
    print("\n1. Getting all users...")
    response = requests.get(f"{BASE_URL}/users/", headers=headers)
    if response.status_code == 200:
        users = response.json()
        print(f"Found {len(users)} users:")
        for user in users:
            print(
                f"  - {user['username']} ({user['role']}) - {'Active' if user['is_active'] else 'Inactive'}")
    else:
        print(f"Failed to get users: {response.status_code}")

    # Test 2: Create a new user
    print("\n2. Creating a new user...")
    new_user = {
        "username": "testuser",
        "email": "test@example.com",
        "password": "testpass123",
        "role": "Editor",
        "permissions": {
            "can_create_content": True,
            "can_edit_content": True,
            "can_publish_content": False,
            "can_schedule_content": False,
            "can_manage_users": False,
            "can_manage_screens": False,
            "can_view_analytics": True,
            "can_manage_settings": False
        }
    }

    response = requests.post(f"{BASE_URL}/users/",
                             headers=headers, json=new_user)
    if response.status_code == 200:
        created_user = response.json()
        print(
            f"Created user: {created_user['username']} (ID: {created_user['id']})")
        user_id = created_user['id']
    else:
        print(f"Failed to create user: {response.status_code}")
        print(response.text)
        return

    # Test 3: Get specific user
    print(f"\n3. Getting user {user_id}...")
    response = requests.get(f"{BASE_URL}/users/{user_id}", headers=headers)
    if response.status_code == 200:
        user = response.json()
        print(f"User details: {user['username']} - {user['role']}")
    else:
        print(f"Failed to get user: {response.status_code}")

    # Test 4: Update user
    print(f"\n4. Updating user {user_id}...")
    update_data = {
        "role": "Client",
        "permissions": {
            "can_create_content": False,
            "can_edit_content": False,
            "can_publish_content": False,
            "can_schedule_content": False,
            "can_manage_users": False,
            "can_manage_screens": False,
            "can_view_analytics": True,
            "can_manage_settings": False
        }
    }

    response = requests.put(
        f"{BASE_URL}/users/{user_id}", headers=headers, json=update_data)
    if response.status_code == 200:
        updated_user = response.json()
        print(f"Updated user role to: {updated_user['role']}")
    else:
        print(f"Failed to update user: {response.status_code}")

    # Test 5: Deactivate user
    print(f"\n5. Deactivating user {user_id}...")
    response = requests.post(
        f"{BASE_URL}/users/{user_id}/deactivate", headers=headers)
    if response.status_code == 200:
        print("User deactivated successfully")
    else:
        print(f"Failed to deactivate user: {response.status_code}")

    # Test 6: Activate user
    print(f"\n6. Activating user {user_id}...")
    response = requests.post(
        f"{BASE_URL}/users/{user_id}/activate", headers=headers)
    if response.status_code == 200:
        print("User activated successfully")
    else:
        print(f"Failed to activate user: {response.status_code}")

    # Test 7: Get users by role
    print("\n7. Getting users by role...")
    for role in ["Admin", "Editor", "Viewer", "Client"]:
        response = requests.get(
            f"{BASE_URL}/users/role/{role}", headers=headers)
        if response.status_code == 200:
            users = response.json()
            print(f"  {role}: {len(users)} users")
        else:
            print(f"Failed to get {role} users: {response.status_code}")

    # Test 8: Delete test user
    print(f"\n8. Deleting test user {user_id}...")
    response = requests.delete(f"{BASE_URL}/users/{user_id}", headers=headers)
    if response.status_code == 200:
        print("Test user deleted successfully")
    else:
        print(f"Failed to delete user: {response.status_code}")

    print("\nUser management tests completed!")


if __name__ == "__main__":
    test_user_management()

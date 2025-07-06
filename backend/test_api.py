import requests
import json

BASE_URL = "http://localhost:8000/api"


def test_health():
    """Test the health endpoint"""
    try:
        response = requests.get("http://localhost:8000/health")
        print(f"Health check: {response.status_code} - {response.json()}")
        return response.status_code == 200
    except Exception as e:
        print(f"Health check failed: {e}")
        return False


def test_login(username, password):
    """Test login endpoint"""
    try:
        response = requests.post(
            f"{BASE_URL}/auth/login",
            json={"username": username, "password": password}
        )
        print(f"Login {username}: {response.status_code}")
        if response.status_code == 200:
            data = response.json()
            print(f"Token received: {data['access_token'][:20]}...")
            return data['access_token']
        else:
            print(f"Login failed: {response.text}")
            return None
    except Exception as e:
        print(f"Login test failed: {e}")
        return None


def test_me_endpoint(token):
    """Test the /me endpoint"""
    try:
        response = requests.get(
            f"{BASE_URL}/auth/me",
            headers={"Authorization": f"Bearer {token}"}
        )
        print(f"Me endpoint: {response.status_code}")
        if response.status_code == 200:
            user_data = response.json()
            print(f"User data: {json.dumps(user_data, indent=2)}")
            return user_data
        else:
            print(f"Me endpoint failed: {response.text}")
            return None
    except Exception as e:
        print(f"Me endpoint test failed: {e}")
        return None


def main():
    print("Testing Display Dynamix Studio Backend API")
    print("=" * 50)

    # Test health endpoint
    if not test_health():
        print("Backend is not running. Please start the backend first.")
        return

    print("\nTesting authentication...")

    # Test login for each user
    users = [
        ("admin", "admin"),
        ("editor", "editor"),
        ("viewer", "viewer")
    ]

    for username, password in users:
        print(f"\n--- Testing {username} ---")
        token = test_login(username, password)
        if token:
            test_me_endpoint(token)

    print("\nAPI testing completed!")


if __name__ == "__main__":
    main()

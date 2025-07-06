#!/usr/bin/env python3
"""
Test script for the configuration system
"""

import sys
import os

# Add the backend directory to the path
sys.path.append(os.path.join(os.path.dirname(__file__), 'backend'))

try:
    from config import get_config

    def test_config():
        """Test the configuration system"""
        print("Testing Configuration System...")
        print("=" * 50)

        # Get configuration
        config = get_config()

        # Test server configuration
        print(f"Server Host: {config.server_host}")
        print(f"Server Port: {config.server_port}")
        print(f"Server Debug: {config.server_debug}")
        print()

        # Test client configuration
        print(f"Client Host: {config.client_host}")
        print(f"Client Port: {config.client_port}")
        print(f"Client Dev Mode: {config.client_dev_mode}")
        print()

        # Test API configuration
        print(f"API Base URL: {config.api_base_url}")
        print(f"API Version: {config.api_version}")
        print(f"API Timeout: {config.api_timeout}")
        print()

        # Test CORS configuration
        print(f"CORS Allowed Origins: {config.cors_allowed_origins}")
        print(f"CORS Allowed Methods: {config.cors_allowed_methods}")
        print(f"CORS Allow Credentials: {config.cors_allow_credentials}")
        print()

        # Test security configuration
        print(f"JWT Algorithm: {config.jwt_algorithm}")
        print(f"JWT Expiration: {config.jwt_expiration}")
        print(f"Password Min Length: {config.password_min_length}")
        print()

        # Test role permissions
        print(f"Admin Permissions: {config.admin_permissions}")
        print(f"Editor Permissions: {config.editor_permissions}")
        print(f"Viewer Permissions: {config.viewer_permissions}")
        print(f"Client Permissions: {config.client_permissions}")
        print()

        # Test feature flags
        print(f"User Management Enabled: {config.feature_user_management}")
        print(f"Analytics Enabled: {config.feature_analytics}")
        print(f"Scheduling Enabled: {config.feature_scheduling}")
        print(f"Media Upload Enabled: {config.feature_media_upload}")
        print()

        # Test development configuration
        print(f"Auto Reload: {config.dev_auto_reload}")
        print(f"Show Debug Info: {config.dev_show_debug_info}")
        print(f"Mock Data: {config.dev_mock_data}")
        print(f"Test Mode: {config.dev_test_mode}")
        print()

        print("Configuration test completed successfully!")
        return True

    if __name__ == "__main__":
        test_config()

except ImportError as e:
    print(f"Error importing configuration: {e}")
    print("Make sure you're running this script from the project root directory.")
    sys.exit(1)
except Exception as e:
    print(f"Error testing configuration: {e}")
    sys.exit(1)

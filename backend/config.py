import configparser
import os
from typing import List, Optional, Dict, Any
from pathlib import Path


class Config:
    """Configuration manager for Display Dynamix Studio"""

    def __init__(self, config_file: str = "config.ini"):
        self.config = configparser.ConfigParser()
        self.config_file = config_file
        self._load_config()

    def _load_config(self):
        """Load configuration from INI file"""
        # Try to find config file in project root
        config_paths = [
            self.config_file,  # Current directory
            f"../{self.config_file}",  # Parent directory
            f"../../{self.config_file}",  # Two levels up
        ]

        config_loaded = False
        for path in config_paths:
            if os.path.exists(path):
                self.config.read(path)
                config_loaded = True
                break

        if not config_loaded:
            raise FileNotFoundError(
                f"Configuration file '{self.config_file}' not found in any of the expected locations")

    def get(self, section: str, key: str, fallback: str = "") -> str:
        """Get a configuration value"""
        try:
            return self.config.get(section, key)
        except (configparser.NoSectionError, configparser.NoOptionError):
            return fallback

    def getint(self, section: str, key: str, fallback: int = 0) -> int:
        """Get a configuration value as integer"""
        try:
            return self.config.getint(section, key)
        except (configparser.NoSectionError, configparser.NoOptionError, ValueError):
            return fallback

    def getboolean(self, section: str, key: str, fallback: bool = False) -> bool:
        """Get a configuration value as boolean"""
        try:
            return self.config.getboolean(section, key)
        except (configparser.NoSectionError, configparser.NoOptionError, ValueError):
            return fallback

    def getlist(self, section: str, key: str, fallback: Optional[List[str]] = None) -> List[str]:
        """Get a configuration value as list (comma-separated)"""
        value = self.get(section, key)
        if value:
            return [item.strip() for item in value.split(',') if item.strip()]
        return fallback or []

    def get_section(self, section: str) -> Dict[str, str]:
        """Get all configuration values from a section"""
        if section in self.config:
            return dict(self.config[section])
        return {}

    # Server configuration
    @property
    def server_host(self) -> str:
        return self.get('server', 'host', 'localhost')

    @property
    def server_port(self) -> int:
        return self.getint('server', 'port', 8000)

    @property
    def server_debug(self) -> bool:
        return self.getboolean('server', 'debug', True)

    @property
    def server_workers(self) -> int:
        return self.getint('server', 'workers', 1)

    # Client configuration
    @property
    def client_host(self) -> str:
        return self.get('client', 'host', 'localhost')

    @property
    def client_port(self) -> int:
        return self.getint('client', 'port', 9002)

    @property
    def client_dev_mode(self) -> bool:
        return self.getboolean('client', 'dev_mode', True)

    # API configuration
    @property
    def api_base_url(self) -> str:
        return self.get('api', 'base_url', 'http://localhost:8000/api')

    @property
    def api_version(self) -> str:
        return self.get('api', 'version', 'v1')

    @property
    def api_timeout(self) -> int:
        return self.getint('api', 'timeout', 30000)

    # CORS configuration
    @property
    def cors_allowed_origins(self) -> List[str]:
        return self.getlist('cors', 'allowed_origins', ['http://localhost:9002'])

    @property
    def cors_allowed_methods(self) -> List[str]:
        return self.getlist('cors', 'allowed_methods', ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'])

    @property
    def cors_allowed_headers(self) -> List[str]:
        return self.getlist('cors', 'allowed_headers', ['Content-Type', 'Authorization'])

    @property
    def cors_allow_credentials(self) -> bool:
        return self.getboolean('cors', 'allow_credentials', True)

    # Database configuration
    @property
    def database_type(self) -> str:
        return self.get('database', 'type', 'sqlite')

    @property
    def database_name(self) -> str:
        return self.get('database', 'name', 'displaydynamix.db')

    @property
    def database_path(self) -> str:
        return self.get('database', 'path', 'backend/')

    @property
    def database_backup_enabled(self) -> bool:
        return self.getboolean('database', 'backup_enabled', True)

    @property
    def database_backup_interval(self) -> int:
        return self.getint('database', 'backup_interval', 24)

    # Security configuration
    @property
    def jwt_secret(self) -> str:
        return self.get('security', 'jwt_secret', 'your-super-secret-jwt-key-change-in-production')

    @property
    def jwt_algorithm(self) -> str:
        return self.get('security', 'jwt_algorithm', 'HS256')

    @property
    def jwt_expiration(self) -> int:
        return self.getint('security', 'jwt_expiration', 3600)

    @property
    def password_min_length(self) -> int:
        return self.getint('security', 'password_min_length', 8)

    @property
    def bcrypt_rounds(self) -> int:
        return self.getint('security', 'bcrypt_rounds', 12)

    # Authentication configuration
    @property
    def session_timeout(self) -> int:
        return self.getint('auth', 'session_timeout', 3600)

    @property
    def max_login_attempts(self) -> int:
        return self.getint('auth', 'max_login_attempts', 5)

    @property
    def lockout_duration(self) -> int:
        return self.getint('auth', 'lockout_duration', 900)

    @property
    def require_email_verification(self) -> bool:
        return self.getboolean('auth', 'require_email_verification', False)

    # Role permissions
    @property
    def admin_permissions(self) -> List[str]:
        return self.getlist('roles', 'admin_permissions')

    @property
    def editor_permissions(self) -> List[str]:
        return self.getlist('roles', 'editor_permissions')

    @property
    def viewer_permissions(self) -> List[str]:
        return self.getlist('roles', 'viewer_permissions')

    @property
    def client_permissions(self) -> List[str]:
        return self.getlist('roles', 'client_permissions')

    # Media configuration
    @property
    def media_upload_path(self) -> str:
        path = self.get('media', 'upload_path', '/srv/displaydynamix-media/')
        # Expand tilde to user's home directory
        if path.startswith('~/'):
            import os
            path = os.path.expanduser(path)
        return path

    @property
    def media_max_file_size(self) -> int:
        return self.getint('media', 'max_file_size', 10485760)

    @property
    def media_allowed_extensions(self) -> List[str]:
        return self.getlist('media', 'allowed_extensions')

    @property
    def media_thumbnail_size(self) -> str:
        return self.get('media', 'thumbnail_size', '300x300')

    @property
    def media_compression_quality(self) -> int:
        return self.getint('media', 'compression_quality', 85)

    # Logging configuration
    @property
    def logging_level(self) -> str:
        return self.get('logging', 'level', 'INFO')

    @property
    def logging_file(self) -> str:
        return self.get('logging', 'file', 'logs/app.log')

    @property
    def logging_max_size(self) -> int:
        return self.getint('logging', 'max_size', 10485760)

    @property
    def logging_backup_count(self) -> int:
        return self.getint('logging', 'backup_count', 5)

    @property
    def logging_format(self) -> str:
        return self.get('logging', 'format', '%(asctime)s - %(name)s - %(levelname)s - %(message)s')

    # Email configuration
    @property
    def email_smtp_host(self) -> str:
        return self.get('email', 'smtp_host', 'smtp.gmail.com')

    @property
    def email_smtp_port(self) -> int:
        return self.getint('email', 'smtp_port', 587)

    @property
    def email_smtp_username(self) -> str:
        return self.get('email', 'smtp_username', '')

    @property
    def email_smtp_password(self) -> str:
        return self.get('email', 'smtp_password', '')

    @property
    def email_use_tls(self) -> bool:
        return self.getboolean('email', 'use_tls', True)

    # Feature flags
    @property
    def feature_user_management(self) -> bool:
        return self.getboolean('features', 'user_management', True)

    @property
    def feature_analytics(self) -> bool:
        return self.getboolean('features', 'analytics', True)

    @property
    def feature_scheduling(self) -> bool:
        return self.getboolean('features', 'scheduling', True)

    @property
    def feature_media_upload(self) -> bool:
        return self.getboolean('features', 'media_upload', True)

    @property
    def feature_real_time_updates(self) -> bool:
        return self.getboolean('features', 'real_time_updates', False)

    # Development configuration
    @property
    def dev_auto_reload(self) -> bool:
        return self.getboolean('development', 'auto_reload', True)

    @property
    def dev_show_debug_info(self) -> bool:
        return self.getboolean('development', 'show_debug_info', True)

    @property
    def dev_mock_data(self) -> bool:
        return self.getboolean('development', 'mock_data', False)

    @property
    def dev_test_mode(self) -> bool:
        return self.getboolean('development', 'test_mode', False)


# Global configuration instance
config = Config()


def get_config() -> Config:
    """Get the global configuration instance"""
    return config


def reload_config():
    """Reload configuration from file"""
    global config
    config = Config()
    return config

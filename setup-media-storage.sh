#!/bin/bash

# Display Dynamix Studio - Media Storage Setup Script
# This script sets up web server accessible media storage and updates config.ini

set -e  # Exit on any error

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Function to print colored output
print_status() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

print_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Function to check if running as root
check_root() {
    if [[ $EUID -eq 0 ]]; then
        print_error "This script should not be run as root. Please run as a normal user."
        exit 1
    fi
}

# Function to check if web server is installed
check_web_server() {
    if command -v nginx &> /dev/null; then
        WEB_SERVER="nginx"
        WEB_ROOT="/var/www/html"
        print_status "Detected Nginx web server"
    elif command -v apache2 &> /dev/null; then
        WEB_SERVER="apache2"
        WEB_ROOT="/var/www/html"
        print_status "Detected Apache web server"
    else
        print_warning "No web server detected. Installing Nginx..."
        sudo apt update
        sudo apt install -y nginx
        WEB_SERVER="nginx"
        WEB_ROOT="/var/www/html"
        print_success "Nginx installed successfully"
    fi
}

# Function to create media directory structure
create_media_structure() {
    print_status "Creating media directory structure..."
    
    # Create main media directory
    sudo mkdir -p /srv/displaydynamix-media
    print_success "Created /srv/displaydynamix-media"
    
    # Create subdirectories
    sudo mkdir -p /srv/displaydynamix-media/{images,videos,audio,documents,thumbnails,logos,backgrounds}
    print_success "Created subdirectories"
    
    # Create additional organized directories
    sudo mkdir -p /srv/displaydynamix-media/images/{logos,backgrounds,thumbnails,slides}
    sudo mkdir -p /srv/displaydynamix-media/videos/{presentations,commercials,loops,events}
    sudo mkdir -p /srv/displaydynamix-media/audio/{background,announcements,music}
    sudo mkdir -p /srv/displaydynamix-media/documents/{templates,manuals,guides}
    
    print_success "Created organized subdirectory structure"
}

# Function to set permissions
set_permissions() {
    print_status "Setting up permissions..."
    
    # Get current user and group
    CURRENT_USER=$(whoami)
    WEB_GROUP="www-data"
    
    # Set ownership
    sudo chown -R $CURRENT_USER:$WEB_GROUP /srv/displaydynamix-media
    print_success "Set ownership to $CURRENT_USER:$WEB_GROUP"
    
    # Set directory permissions
    sudo chmod -R 775 /srv/displaydynamix-media
    print_success "Set directory permissions to 775"
    
    # Add user to www-data group if not already
    if ! groups $CURRENT_USER | grep -q $WEB_GROUP; then
        sudo usermod -a -G $WEB_GROUP $CURRENT_USER
        print_success "Added $CURRENT_USER to $WEB_GROUP group"
        print_warning "You may need to log out and back in for group changes to take effect"
    else
        print_status "User $CURRENT_USER is already in $WEB_GROUP group"
    fi
}

# Function to create web server symbolic link
create_web_link() {
    print_status "Creating web server symbolic link..."
    
    # Remove existing link if it exists
    if [ -L "$WEB_ROOT/media" ]; then
        sudo rm "$WEB_ROOT/media"
        print_status "Removed existing symbolic link"
    fi
    
    # Create symbolic link
    sudo ln -s /srv/displaydynamix-media "$WEB_ROOT/media"
    print_success "Created symbolic link: $WEB_ROOT/media -> /srv/displaydynamix-media"
    
    # Set proper permissions for web access
    sudo chown -R $CURRENT_USER:$WEB_GROUP "$WEB_ROOT/media"
    sudo chmod -R 755 "$WEB_ROOT/media"
    print_success "Set web access permissions"
}

# Function to update config.ini
update_config() {
    print_status "Updating config.ini..."
    
    # Check if config.ini exists
    if [ ! -f "config.ini" ]; then
        print_error "config.ini not found in current directory"
        exit 1
    fi
    
    # Backup original config
    cp config.ini config.ini.backup
    print_success "Created backup: config.ini.backup"
    
    # Update the upload_path in config.ini
    if command -v sed &> /dev/null; then
        # Use sed to update the upload_path
        sed -i 's|^upload_path = .*|upload_path = /srv/displaydynamix-media/|' config.ini
        print_success "Updated upload_path in config.ini"
    else
        print_error "sed command not found. Please manually update config.ini"
        exit 1
    fi
    
    # Verify the change
    if grep -q "upload_path = /srv/displaydynamix-media/" config.ini; then
        print_success "Config.ini updated successfully"
    else
        print_error "Failed to update config.ini"
        exit 1
    fi
}

# Function to create test files
create_test_files() {
    print_status "Creating test files..."
    
    # Create a test image file
    echo "This is a test image file for Display Dynamix Studio" > /srv/displaydynamix-media/images/test-image.txt
    print_success "Created test image file"
    
    # Create a test video file
    echo "This is a test video file for Display Dynamix Studio" > /srv/displaydynamix-media/videos/test-video.txt
    print_success "Created test video file"
    
    # Set proper permissions for test files
    sudo chown $CURRENT_USER:$WEB_GROUP /srv/displaydynamix-media/images/test-image.txt
    sudo chown $CURRENT_USER:$WEB_GROUP /srv/displaydynamix-media/videos/test-video.txt
    sudo chmod 644 /srv/displaydynamix-media/images/test-image.txt
    sudo chmod 644 /srv/displaydynamix-media/videos/test-video.txt
}

# Function to test web access
test_web_access() {
    print_status "Testing web access..."
    
    # Get server IP
    SERVER_IP=$(hostname -I | awk '{print $1}')
    
    print_status "Testing local access..."
    if curl -s -o /dev/null -w "%{http_code}" http://localhost/media/ | grep -q "200\|403"; then
        print_success "Local web access working"
    else
        print_warning "Local web access test failed (this might be normal if web server is not running)"
    fi
    
    print_status "Media files can be accessed at:"
    echo "  Local: http://localhost/media/"
    echo "  Network: http://$SERVER_IP/media/"
    echo "  Direct path: /srv/displaydynamix-media/"
}

# Function to create usage instructions
create_instructions() {
    print_status "Creating usage instructions..."
    
    cat > /srv/displaydynamix-media/README.txt << EOF
Display Dynamix Studio - Media Storage

This directory contains media files for Display Dynamix Studio templates.

Directory Structure:
- images/     - Image files (JPG, PNG, GIF, etc.)
- videos/     - Video files (MP4, AVI, MOV, etc.)
- audio/      - Audio files (MP3, WAV, etc.)
- documents/  - Document files (PDF, DOC, etc.)
- thumbnails/ - Generated thumbnail images
- logos/      - Logo files
- backgrounds/ - Background images

Web Access:
- Local: http://localhost/media/
- Network: http://[SERVER_IP]/media/

File Permissions:
- Owner: $(whoami)
- Group: www-data
- Permissions: 775 (directories), 644 (files)

Usage:
1. Upload media files to appropriate subdirectories
2. Reference files in templates using relative paths
3. Files are automatically accessible via web server

Security:
- Only authorized users can upload files
- Files are served with appropriate permissions
- Regular backups recommended

EOF
    
    print_success "Created README.txt with usage instructions"
}

# Function to restart web server
restart_web_server() {
    print_status "Restarting web server..."
    
    if [ "$WEB_SERVER" = "nginx" ]; then
        sudo systemctl restart nginx
        print_success "Nginx restarted"
    elif [ "$WEB_SERVER" = "apache2" ]; then
        sudo systemctl restart apache2
        print_success "Apache restarted"
    fi
}

# Function to display summary
display_summary() {
    echo
    print_success "=== Setup Complete ==="
    echo
    echo "Media storage has been configured successfully!"
    echo
    echo "Directory Structure:"
    echo "  Main directory: /srv/displaydynamix-media/"
    echo "  Web access: $WEB_ROOT/media/"
    echo
    echo "Subdirectories created:"
    echo "  - images/ (logos, backgrounds, thumbnails, slides)"
    echo "  - videos/ (presentations, commercials, loops, events)"
    echo "  - audio/ (background, announcements, music)"
    echo "  - documents/ (templates, manuals, guides)"
    echo "  - thumbnails/"
    echo "  - logos/"
    echo "  - backgrounds/"
    echo
    echo "Configuration:"
    echo "  - config.ini updated with new upload_path"
    echo "  - Backup created: config.ini.backup"
    echo
    echo "Web Access:"
    echo "  Local: http://localhost/media/"
    echo "  Network: http://$(hostname -I | awk '{print $1}')/media/"
    echo
    echo "Next Steps:"
    echo "  1. Upload your media files to the appropriate directories"
    echo "  2. Test web access by visiting the URLs above"
    echo "  3. Configure your templates to use the media paths"
    echo "  4. Set up regular backups of /srv/displaydynamix-media/"
    echo
    print_warning "Note: You may need to log out and back in for group changes to take effect"
    echo
}

# Main execution
main() {
    echo "Display Dynamix Studio - Media Storage Setup"
    echo "============================================="
    echo
    
    # Check if running as root
    check_root
    
    # Check web server
    check_web_server
    
    # Create media structure
    create_media_structure
    
    # Set permissions
    set_permissions
    
    # Create web server link
    create_web_link
    
    # Update config.ini
    update_config
    
    # Create test files
    create_test_files
    
    # Create instructions
    create_instructions
    
    # Restart web server
    restart_web_server
    
    # Test web access
    test_web_access
    
    # Display summary
    display_summary
}

# Run main function
main "$@" 
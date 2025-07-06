# Local Storage Usage for Display Dynamix Studio

## Overview

Display Dynamix Studio now supports local storage for images and videos, allowing you to store media files on the server and access them directly in your displays without external dependencies.

## Setup

1. **Run the setup script** (if not already done):
   ```bash
   sudo ./setup-media-storage.sh
   ```

2. **Upload your media files** to the appropriate directories:
   - Images: `/srv/displaydynamix-media/images/`
   - Videos: `/srv/displaydynamix-media/videos/`

## Using Local Storage in the Dashboard

### For Images:
1. Add an Image element to your canvas
2. In the properties panel, click the folder icon next to the "Image Source" field
3. Select an image from the local storage browser
4. The image will be loaded with the URL format: `/media/images/filename.jpg`

### For Videos:
1. Add a Video element to your canvas
2. In the properties panel, click the folder icon next to the "Video Source" field
3. Select a video from the local storage browser
4. Configure video properties:
   - **Autoplay**: Automatically start playing when loaded
   - **Loop**: Repeat the video continuously
   - **Muted**: Play without sound (recommended for autoplay)
   - **Controls**: Show video player controls

## Supported File Formats

### Images:
- JPG/JPEG
- PNG
- GIF
- BMP
- WebP
- SVG

### Videos:
- MP4
- AVI
- MOV
- WMV
- FLV
- WebM
- MKV

## File Organization

The local storage is organized as follows:
```
/srv/displaydynamix-media/
├── images/
│   ├── logo.png
│   ├── background.jpg
│   └── icons/
├── videos/
│   ├── intro.mp4
│   ├── loop.webm
│   └── presentations/
└── other/
    └── documents/
```

## Web Access

Files are accessible via web URLs:
- Images: `http://your-server/media/images/filename.jpg`
- Videos: `http://your-server/media/videos/filename.mp4`

## Security

- Only files in the designated media directories are accessible
- Directory traversal attacks are prevented
- Files are served with appropriate MIME types
- Caching is enabled for better performance

## Troubleshooting

### Files not appearing in browser:
1. Check file permissions: `ls -la /srv/displaydynamix-media/images/`
2. Ensure files are in the correct directory
3. Verify file extensions are supported
4. Check web server configuration

### Permission errors:
1. Run the setup script again: `sudo ./setup-media-storage.sh`
2. Check web server user permissions
3. Verify symbolic links are correct

### Performance issues:
1. Optimize image/video file sizes
2. Use appropriate formats (WebP for images, MP4 for videos)
3. Consider using CDN for high-traffic scenarios

## Best Practices

1. **File naming**: Use descriptive, lowercase names with hyphens
2. **File sizes**: Keep images under 5MB, videos under 100MB for web performance
3. **Formats**: Use WebP for images, MP4 for videos when possible
4. **Organization**: Create subdirectories for better organization
5. **Backup**: Regularly backup your media files

## API Endpoints

- `GET /api/media/list?type=images` - List all images
- `GET /api/media/list?type=videos` - List all videos
- `GET /media/images/filename.jpg` - Serve image file
- `GET /media/videos/filename.mp4` - Serve video file 
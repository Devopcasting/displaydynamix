import { NextRequest, NextResponse } from 'next/server';
import { promises as fs } from 'fs';
import path from 'path';

export async function GET(
    request: NextRequest,
    { params }: { params: Promise<{ path: string[] }> }
) {
    try {
        const resolvedParams = await params;
        const filePath = resolvedParams.path.join('/');

        // Validate path to prevent directory traversal
        if (filePath.includes('..') || filePath.startsWith('/')) {
            return NextResponse.json({ error: 'Invalid path' }, { status: 400 });
        }

        // Base media directory
        const mediaBaseDir = '/srv/displaydynamix-media';
        const fullPath = path.join(mediaBaseDir, filePath);

        // Check if file exists
        try {
            await fs.access(fullPath);
        } catch (error) {
            return NextResponse.json({ error: 'File not found' }, { status: 404 });
        }

        // Read file
        const fileBuffer = await fs.readFile(fullPath);

        // Determine content type based on file extension
        const ext = path.extname(fullPath).toLowerCase();
        let contentType = 'application/octet-stream';

        const mimeTypes: { [key: string]: string } = {
            '.jpg': 'image/jpeg',
            '.jpeg': 'image/jpeg',
            '.png': 'image/png',
            '.gif': 'image/gif',
            '.bmp': 'image/bmp',
            '.webp': 'image/webp',
            '.svg': 'image/svg+xml',
            '.mp4': 'video/mp4',
            '.avi': 'video/x-msvideo',
            '.mov': 'video/quicktime',
            '.wmv': 'video/x-ms-wmv',
            '.flv': 'video/x-flv',
            '.webm': 'video/webm',
            '.mkv': 'video/x-matroska',
        };

        if (mimeTypes[ext]) {
            contentType = mimeTypes[ext];
        }

        // Return file with appropriate headers
        return new NextResponse(fileBuffer, {
            headers: {
                'Content-Type': contentType,
                'Cache-Control': 'public, max-age=3600', // Cache for 1 hour
            },
        });
    } catch (error) {
        console.error('Error serving media file:', error);
        return NextResponse.json({ error: 'Failed to serve file' }, { status: 500 });
    }
} 
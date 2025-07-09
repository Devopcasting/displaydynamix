import { NextRequest, NextResponse } from 'next/server';
import { promises as fs } from 'fs';
import path from 'path';
import { withCors } from '@/lib/cors';

async function handleGET(request: NextRequest) {
    try {
        const { searchParams } = new URL(request.url);
        const type = searchParams.get('type'); // 'images' or 'videos'

        if (!type || !['images', 'videos'].includes(type)) {
            return NextResponse.json({ error: 'Invalid type parameter. Must be "images" or "videos"' }, { status: 400 });
        }

        // Base media directory from config
        const mediaBaseDir = '/srv/displaydynamix-media';
        const mediaDir = path.join(mediaBaseDir, type);

        // Check if directory exists
        try {
            await fs.access(mediaDir);
        } catch (error) {
            return NextResponse.json({ error: `Media directory not found: ${mediaDir}` }, { status: 404 });
        }

        // Read directory contents
        const files = await fs.readdir(mediaDir);

        // Filter for appropriate file types
        const allowedExtensions = type === 'images'
            ? ['.jpg', '.jpeg', '.png', '.gif', '.bmp', '.webp', '.svg']
            : ['.mp4', '.avi', '.mov', '.wmv', '.flv', '.webm', '.mkv'];

        const mediaFiles = files.filter(file => {
            const ext = path.extname(file).toLowerCase();
            return allowedExtensions.includes(ext);
        });

        // Sort files alphabetically
        mediaFiles.sort();

        return NextResponse.json(mediaFiles);
    } catch (error) {
        console.error('Error listing media files:', error);
        return NextResponse.json({ error: 'Failed to list media files' }, { status: 500 });
    }
}

export const GET = withCors(handleGET); 
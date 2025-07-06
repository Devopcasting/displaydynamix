'use client';
import { useState, useEffect } from 'react';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { ScrollArea } from '@/components/ui/scroll-area';
import { FolderOpen, Upload, Video as VideoIcon, Play, Pause, Volume2 } from 'lucide-react';
import type { CanvasElement } from '../../page';

interface VideoPropertiesProps {
    properties: CanvasElement['properties'];
    onUpdate: (updates: Partial<CanvasElement['properties']>) => void;
    onElementUpdate?: (updates: Partial<CanvasElement>) => void;
}

export default function VideoProperties({ properties, onUpdate, onElementUpdate }: VideoPropertiesProps) {
    const [localFiles, setLocalFiles] = useState<string[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [selectedFile, setSelectedFile] = useState<string>('');

    // Fetch local media files
    const fetchLocalFiles = async () => {
        setIsLoading(true);
        try {
            const response = await fetch('/api/media/list?type=videos');
            if (response.ok) {
                const files = await response.json();
                setLocalFiles(files);
            }
        } catch (error) {
            console.error('Failed to fetch local files:', error);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchLocalFiles();
    }, []);

    const handleFileSelect = (file: string) => {
        const mediaUrl = `/media/videos/${file}`;
        onUpdate({ src: mediaUrl });
        setSelectedFile(file);

        // Auto-resize to actual video dimensions
        const video = document.createElement('video');
        video.onloadedmetadata = () => {
            if (onElementUpdate) {
                onElementUpdate({
                    width: video.videoWidth,
                    height: video.videoHeight
                });
            }
        };
        video.onerror = () => {
            console.error('Failed to load video for dimension detection');
        };
        video.src = mediaUrl;
    };

    const handleUrlChange = (url: string) => {
        onUpdate({ src: url });
        setSelectedFile(''); // Clear selected file when URL is manually entered

        // Auto-resize to actual video dimensions if URL is provided
        if (url && url.trim() !== '') {
            const video = document.createElement('video');
            video.onloadedmetadata = () => {
                if (onElementUpdate) {
                    onElementUpdate({
                        width: video.videoWidth,
                        height: video.videoHeight
                    });
                }
            };
            video.onerror = () => {
                console.error('Failed to load video for dimension detection');
            };
            video.src = url;
        }
    };

    return (
        <div className="space-y-4">
            <div>
                <Label>Video Source</Label>
                <div className="flex gap-2">
                    <Input
                        value={properties.src || ''}
                        onChange={e => handleUrlChange(e.target.value)}
                        placeholder="Enter URL or select from local storage"
                    />
                    <Dialog>
                        <DialogTrigger asChild>
                            <Button variant="outline" size="icon" onClick={fetchLocalFiles}>
                                <FolderOpen className="h-4 w-4" />
                            </Button>
                        </DialogTrigger>
                        <DialogContent className="max-w-md">
                            <DialogHeader>
                                <DialogTitle>Select Video from Local Storage</DialogTitle>
                            </DialogHeader>
                            <div className="space-y-4">
                                <div className="flex items-center gap-2">
                                    <Button variant="outline" size="sm" onClick={fetchLocalFiles} disabled={isLoading}>
                                        <Upload className="h-4 w-4 mr-2" />
                                        Refresh
                                    </Button>
                                    {isLoading && <span className="text-sm text-muted-foreground">Loading...</span>}
                                </div>
                                <ScrollArea className="h-64 border rounded-md p-2">
                                    {localFiles.length === 0 ? (
                                        <div className="text-center text-muted-foreground py-8">
                                            <VideoIcon className="h-8 w-8 mx-auto mb-2 opacity-50" />
                                            <p>No videos found in local storage</p>
                                            <p className="text-xs">Upload videos to /srv/displaydynamix-media/videos/</p>
                                        </div>
                                    ) : (
                                        <div className="grid grid-cols-2 gap-2">
                                            {localFiles.map((file) => (
                                                <div
                                                    key={file}
                                                    className={`p-2 border rounded cursor-pointer hover:bg-accent transition-colors ${selectedFile === file ? 'border-primary bg-accent' : ''
                                                        }`}
                                                    onClick={() => handleFileSelect(file)}
                                                >
                                                    <div className="aspect-video bg-muted rounded mb-2 flex items-center justify-center">
                                                        <VideoIcon className="h-6 w-6 text-muted-foreground" />
                                                    </div>
                                                    <p className="text-xs truncate" title={file}>
                                                        {file}
                                                    </p>
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </ScrollArea>
                                {selectedFile && (
                                    <div className="text-sm text-muted-foreground">
                                        Selected: {selectedFile}
                                    </div>
                                )}
                            </div>
                        </DialogContent>
                    </Dialog>
                </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
                <div>
                    <Label>Autoplay</Label>
                    <Select value={properties.autoplay ? 'true' : 'false'} onValueChange={value => onUpdate({ autoplay: value === 'true' })}>
                        <SelectTrigger>
                            <SelectValue placeholder="Select autoplay" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="true">Yes</SelectItem>
                            <SelectItem value="false">No</SelectItem>
                        </SelectContent>
                    </Select>
                </div>
                <div>
                    <Label>Loop</Label>
                    <Select value={properties.loop ? 'true' : 'false'} onValueChange={value => onUpdate({ loop: value === 'true' })}>
                        <SelectTrigger>
                            <SelectValue placeholder="Select loop" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="true">Yes</SelectItem>
                            <SelectItem value="false">No</SelectItem>
                        </SelectContent>
                    </Select>
                </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
                <div>
                    <Label>Muted</Label>
                    <Select value={properties.muted ? 'true' : 'false'} onValueChange={value => onUpdate({ muted: value === 'true' })}>
                        <SelectTrigger>
                            <SelectValue placeholder="Select muted" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="true">Yes</SelectItem>
                            <SelectItem value="false">No</SelectItem>
                        </SelectContent>
                    </Select>
                </div>
                <div>
                    <Label>Controls</Label>
                    <Select value={properties.controls ? 'true' : 'false'} onValueChange={value => onUpdate({ controls: value === 'true' })}>
                        <SelectTrigger>
                            <SelectValue placeholder="Select controls" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="true">Show</SelectItem>
                            <SelectItem value="false">Hide</SelectItem>
                        </SelectContent>
                    </Select>
                </div>
            </div>
        </div>
    );
} 
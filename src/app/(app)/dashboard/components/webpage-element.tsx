'use client';

import { useState, useEffect } from 'react';
import type { CanvasElement } from '../page';
import { Loader2, AlertCircle, Globe } from 'lucide-react';

interface WebpageElementProps {
    properties: CanvasElement['properties'];
}

export default function WebpageElement({ properties }: WebpageElementProps) {
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [iframeKey, setIframeKey] = useState(0);

    const {
        url = '',
        allowFullscreen = false,
        showScrollbars = true,
        refreshInterval = 0, // 0 means no auto-refresh
        backgroundColor = 'transparent'
    } = properties;

    // Check if we're in preview mode
    const isPreviewMode = typeof window !== 'undefined' && window.location.pathname === '/preview';

    useEffect(() => {
        if (!url || url.trim() === '') {
            if (isPreviewMode) {
                setLoading(false);
            } else {
                setError('Please provide a webpage URL');
                setLoading(false);
            }
            return;
        }

        setLoading(true);
        setError(null);

        // Validate URL format
        try {
            const urlObj = new URL(url);
            if (!urlObj.protocol.startsWith('http')) {
                throw new Error('URL must start with http:// or https://');
            }
        } catch (err) {
            setError('Please enter a valid URL (e.g., https://example.com)');
            setLoading(false);
            return;
        }
    }, [url, isPreviewMode]);

    // Auto-refresh functionality
    useEffect(() => {
        if (refreshInterval > 0 && url) {
            const interval = setInterval(() => {
                setIframeKey(prev => prev + 1);
            }, refreshInterval * 1000);

            return () => clearInterval(interval);
        }
    }, [refreshInterval, url]);

    const handleIframeLoad = () => {
        setLoading(false);
        setError(null);
    };

    const handleIframeError = () => {
        setLoading(false);
        setError('Failed to load webpage');
    };

    const style: React.CSSProperties = {
        width: '100%',
        height: '100%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: backgroundColor,
        position: 'relative'
    };

    if (loading && url) {
        return (
            <div style={style}>
                <div className="flex flex-col items-center justify-center h-full text-muted-foreground">
                    <Loader2 className="w-6 h-6 animate-spin mb-2" />
                    <p className="text-sm">Loading webpage...</p>
                </div>
            </div>
        );
    }

    if (error) {
        // In preview mode, show sample content instead of error
        if (isPreviewMode) {
            return (
                <div style={style}>
                    <div className="flex flex-col items-center justify-center h-full text-muted-foreground p-4">
                        <Globe className="w-8 h-8 mb-2" />
                        <h3 className="text-lg font-semibold mb-2">Sample Webpage</h3>
                        <p className="text-sm text-center">
                            This is a sample webpage display. In the editor, you can configure a real URL to display actual web content.
                        </p>
                        <div className="mt-4 p-3 bg-muted rounded text-xs">
                            <p><strong>Example URL:</strong> https://example.com</p>
                            <p><strong>Features:</strong> Auto-refresh, Fullscreen, Scrollbars</p>
                        </div>
                    </div>
                </div>
            );
        }

        return (
            <div style={style}>
                <div className="flex flex-col items-center justify-center h-full text-destructive">
                    <AlertCircle className="w-6 h-6 mb-2" />
                    <p className="text-sm font-semibold">Webpage Error</p>
                    <p className="text-xs text-center">{error}</p>
                </div>
            </div>
        );
    }

    if (!url || url.trim() === '') {
        // Show sample content for empty URL
        return (
            <div style={style}>
                <div className="flex flex-col items-center justify-center h-full text-muted-foreground p-4">
                    <Globe className="w-8 h-8 mb-2" />
                    <h3 className="text-lg font-semibold mb-2">Webpage Element</h3>
                    <p className="text-sm text-center">
                        Enter a URL in the properties panel to display a webpage here.
                    </p>
                    <div className="mt-4 p-3 bg-muted rounded text-xs">
                        <p><strong>Example URLs:</strong></p>
                        <p>• https://example.com</p>
                        <p>• https://news.ycombinator.com</p>
                        <p>• https://weather.com</p>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div style={style}>
            <iframe
                key={iframeKey}
                src={url}
                style={{
                    width: '100%',
                    height: '100%',
                    border: 'none',
                    overflow: showScrollbars ? 'auto' : 'hidden'
                }}
                allowFullScreen={allowFullscreen}
                onLoad={handleIframeLoad}
                onError={handleIframeError}
                title="Webpage content"
                sandbox="allow-scripts allow-same-origin allow-forms allow-popups allow-popups-to-escape-sandbox"
            />
        </div>
    );
} 
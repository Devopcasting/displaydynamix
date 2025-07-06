'use client';

import { useState, useEffect } from 'react';
import type { CanvasElement } from '../page';
import { Loader2, AlertCircle, Rss } from 'lucide-react';

interface RSSFeedElementProps {
    properties: CanvasElement['properties'];
}

interface RSSItem {
    title: string;
    description: string;
    link: string;
    pubDate: string;
}

interface RSSFeed {
    title: string;
    description: string;
    items: RSSItem[];
}

export default function RSSFeedElement({ properties }: RSSFeedElementProps) {
    const [feed, setFeed] = useState<RSSFeed | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [currentItemIndex, setCurrentItemIndex] = useState(0);

    // Check if we're in preview mode
    const isPreviewMode = typeof window !== 'undefined' && window.location.pathname === '/preview';

    // Helper function to create sample feed data
    const createSampleFeed = (): RSSFeed => ({
        title: 'Sample RSS Feed',
        description: 'This is a sample RSS feed for preview purposes',
        items: [
            {
                title: 'Sample Article 1',
                description: 'This is a sample article description for preview purposes.',
                link: '#',
                pubDate: new Date().toISOString()
            },
            {
                title: 'Sample Article 2',
                description: 'Another sample article to demonstrate the RSS feed functionality.',
                link: '#',
                pubDate: new Date().toISOString()
            }
        ]
    });

    // Helper function to render sample feed
    const renderSampleFeed = (sampleFeed: RSSFeed) => (
        <div style={style}>
            <div className="mb-2">
                <h3 className="font-bold text-lg" style={{ fontSize: `${fontSize * 1.2}px` }}>
                    {sampleFeed.title}
                </h3>
            </div>
            <div className="flex-1">
                <div className="mb-2">
                    <h4 className="font-semibold" style={{ fontSize: `${fontSize * 1.1}px` }}>
                        {sampleFeed.items[0].title}
                    </h4>
                </div>
                {showDescription && (
                    <div className="mb-2 text-sm opacity-90">
                        <p>{sampleFeed.items[0].description}</p>
                    </div>
                )}
                {showDate && (
                    <div className="text-xs opacity-75">
                        {formatDate(sampleFeed.items[0].pubDate)}
                    </div>
                )}
            </div>
            <div className="flex justify-center mt-2">
                <div className="flex space-x-1">
                    <div className="w-2 h-2 rounded-full bg-current" />
                    <div className="w-2 h-2 rounded-full bg-current opacity-30" />
                </div>
            </div>
        </div>
    );

    const {
        feedUrl = '',
        maxItems = 5,
        showTitle = true,
        showDescription = true,
        showDate = true,
        autoRotate = true,
        rotationSpeed = 5,
        fontSize = 16,
        color = '#000000',
        backgroundColor = 'transparent',
        bold = false,
        italic = false,
        textAlign = 'left'
    } = properties;

    useEffect(() => {
        if (!feedUrl || feedUrl.trim() === '') {
            if (isPreviewMode) {
                // In preview mode, show sample data instead of error
                setLoading(false);
                return;
            } else {
                setError('Please provide an RSS feed URL');
                setLoading(false);
                return;
            }
        }

        setLoading(true);
        setError(null);
        setFeed(null);

        const fetchRSSFeed = async () => {
            try {
                console.log('Fetching RSS feed:', feedUrl);

                // In preview mode, use a shorter timeout
                const timeout = isPreviewMode ? 5000 : 10000;
                const controller = new AbortController();
                const timeoutId = setTimeout(() => controller.abort(), timeout);

                // Use a CORS proxy to avoid CORS issues
                const proxyUrl = `https://api.allorigins.win/get?url=${encodeURIComponent(feedUrl)}`;
                console.log('Using proxy URL:', proxyUrl);

                const response = await fetch(proxyUrl, {
                    signal: controller.signal
                });

                clearTimeout(timeoutId);

                if (!response.ok) {
                    throw new Error(`Failed to fetch RSS feed: ${response.status}`);
                }

                const data = await response.json();
                console.log('RSS feed response:', data);
                const xmlText = data.contents;

                // Parse XML to extract RSS items
                const parser = new DOMParser();
                const xmlDoc = parser.parseFromString(xmlText, 'text/xml');

                // Check for parsing errors
                const parseError = xmlDoc.querySelector('parsererror');
                if (parseError) {
                    throw new Error('Invalid RSS feed format');
                }

                // Extract channel info
                const channel = xmlDoc.querySelector('channel');
                if (!channel) {
                    throw new Error('No channel found in RSS feed');
                }

                const channelTitle = channel.querySelector('title')?.textContent || 'RSS Feed';
                const channelDescription = channel.querySelector('description')?.textContent || '';

                // Extract items
                const items = Array.from(xmlDoc.querySelectorAll('item')).slice(0, maxItems).map(item => ({
                    title: item.querySelector('title')?.textContent || 'No title',
                    description: item.querySelector('description')?.textContent || 'No description',
                    link: item.querySelector('link')?.textContent || '',
                    pubDate: item.querySelector('pubDate')?.textContent || ''
                }));

                setFeed({
                    title: channelTitle,
                    description: channelDescription,
                    items
                });
            } catch (err) {
                console.error('RSS feed error:', err);
                if (isPreviewMode) {
                    // In preview mode, don't show errors, just stop loading
                    console.log('RSS feed error in preview mode, will show sample data');
                } else {
                    if (err instanceof Error && err.name === 'AbortError') {
                        setError('Request timed out. Please check your internet connection.');
                    } else {
                        setError(err instanceof Error ? err.message : 'Failed to fetch RSS feed');
                    }
                }
            } finally {
                setLoading(false);
            }
        };

        fetchRSSFeed();
    }, [feedUrl, maxItems]);

    // Auto-rotate through items
    useEffect(() => {
        if (!autoRotate || !feed || feed.items.length <= 1) return;

        const interval = setInterval(() => {
            setCurrentItemIndex((prev) => (prev + 1) % feed.items.length);
        }, rotationSpeed * 1000);

        return () => clearInterval(interval);
    }, [autoRotate, feed, rotationSpeed]);

    const formatDate = (dateString: string) => {
        try {
            const date = new Date(dateString);
            return date.toLocaleDateString('en-US', {
                month: 'short',
                day: 'numeric',
                hour: '2-digit',
                minute: '2-digit'
            });
        } catch {
            return dateString;
        }
    };

    const style: React.CSSProperties = {
        width: '100%',
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        padding: '12px',
        fontSize: `${fontSize}px`,
        color: color,
        backgroundColor: backgroundColor,
        fontWeight: bold ? 'bold' : 'normal',
        fontStyle: italic ? 'italic' : 'normal',
        textAlign: textAlign as 'left' | 'center' | 'right',
        overflow: 'hidden'
    };

    if (loading) {
        // In preview mode, show sample data instead of loading spinner
        if (isPreviewMode && (!feedUrl || feedUrl.trim() === '')) {
            return renderSampleFeed(createSampleFeed());
        }

        return (
            <div style={style}>
                <div className="flex flex-col items-center justify-center h-full text-muted-foreground">
                    <Loader2 className="w-6 h-6 animate-spin mb-2" />
                    <p className="text-sm">Loading RSS Feed...</p>
                </div>
            </div>
        );
    }

    if (error) {
        // In preview mode, show sample data instead of error
        if (isPreviewMode) {
            return renderSampleFeed(createSampleFeed());
        }

        return (
            <div style={style}>
                <div className="flex flex-col items-center justify-center h-full text-destructive">
                    <AlertCircle className="w-6 h-6 mb-2" />
                    <p className="text-sm font-semibold">RSS Feed Error</p>
                    <p className="text-xs text-center">{error}</p>
                </div>
            </div>
        );
    }

    if (!feed || feed.items.length === 0) {
        // Show sample data for preview purposes
        return renderSampleFeed(createSampleFeed());
    }

    const currentItem = feed.items[currentItemIndex];

    return (
        <div style={style}>
            {showTitle && feed.title && (
                <div className="mb-2">
                    <h3 className="font-bold text-lg" style={{ fontSize: `${fontSize * 1.2}px` }}>
                        {feed.title}
                    </h3>
                </div>
            )}

            <div className="flex-1">
                <div className="mb-2">
                    <h4 className="font-semibold" style={{ fontSize: `${fontSize * 1.1}px` }}>
                        {currentItem.title}
                    </h4>
                </div>

                {showDescription && currentItem.description && (
                    <div className="mb-2 text-sm opacity-90">
                        <p>{currentItem.description.replace(/<[^>]*>/g, '')}</p>
                    </div>
                )}

                {showDate && currentItem.pubDate && (
                    <div className="text-xs opacity-75">
                        {formatDate(currentItem.pubDate)}
                    </div>
                )}
            </div>

            {feed.items.length > 1 && (
                <div className="flex justify-center mt-2">
                    <div className="flex space-x-1">
                        {feed.items.map((_, index) => (
                            <div
                                key={index}
                                className={`w-2 h-2 rounded-full ${index === currentItemIndex ? 'bg-current' : 'bg-current opacity-30'
                                    }`}
                            />
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
} 
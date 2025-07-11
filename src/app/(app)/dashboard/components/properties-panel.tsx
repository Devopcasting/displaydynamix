
'use client';
import type { CanvasElement } from '../page';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Separator } from '@/components/ui/separator';
import { Button } from '@/components/ui/button';
import { Trash2 } from 'lucide-react';

import CommonProperties from './properties/common-properties';
import TextProperties from './properties/text-properties';
import ImageProperties from './properties/image-properties';
import VideoProperties from './properties/video-properties';
import ShapeProperties from './properties/shape-properties';
import MarqueeProperties from './properties/marquee-properties';
import WeatherProperties from './properties/weather-properties';
import TimeDateProperties from './properties/time-date-properties';
import RSSFeedProperties from './properties/rss-feed-properties';
import WebpageProperties from './properties/webpage-properties';
import QRCodeProperties from './properties/qr-code-properties';

interface PropertiesPanelProps {
    element: CanvasElement | null;
    onUpdate: (id: number, updates: Partial<CanvasElement>) => void;
    onDelete: () => void;
    isReadOnly?: boolean;
    canvasResolution: { width: number; height: number; mode: string };
}

export default function PropertiesPanel({ element, onUpdate, onDelete, isReadOnly = false, canvasResolution }: PropertiesPanelProps) {
    if (isReadOnly) {
        return (
            <div className="p-4 text-center text-muted-foreground py-10">
                <p className="text-xs">Viewing in read-only mode.</p>
                <p className="text-xs mt-2">Editing properties is disabled for your role.</p>
            </div>
        )
    }

    if (!element) {
        return (
            <div className="p-4 text-center text-muted-foreground py-10">
                <p className="text-xs">Select an element on the canvas to edit its properties.</p>
            </div>
        );
    }

    // Alignment handlers
    const alignTo = (direction: 'top' | 'middle' | 'bottom' | 'left' | 'center' | 'right') => {
        const { width: canvasWidth, height: canvasHeight } = canvasResolution;
        let updates: Partial<CanvasElement> = {};
        switch (direction) {
            case 'top':
                updates.y = 0;
                break;
            case 'middle':
                updates.y = Math.round((canvasHeight - element.height) / 2);
                break;
            case 'bottom':
                updates.y = canvasHeight - element.height;
                break;
            case 'left':
                updates.x = 0;
                break;
            case 'center':
                updates.x = Math.round((canvasWidth - element.width) / 2);
                break;
            case 'right':
                updates.x = canvasWidth - element.width;
                break;
        }
        onUpdate(element.id, updates);
    };

    const handleUpdateProperties = (updates: Partial<CanvasElement['properties']>) => {
        onUpdate(element.id, { properties: { ...element.properties, ...updates } });
    };

    const handleUpdateElement = (updates: Partial<CanvasElement>) => {
        onUpdate(element.id, updates);
    };

    const renderElementProperties = () => {
        switch (element.type) {
            case 'Text':
                return <TextProperties properties={element.properties} onUpdate={handleUpdateProperties} />;
            case 'Image':
                return <ImageProperties properties={element.properties} onUpdate={handleUpdateProperties} onElementUpdate={handleUpdateElement} />;
            case 'Video':
                return <VideoProperties properties={element.properties} onUpdate={handleUpdateProperties} onElementUpdate={handleUpdateElement} />;
            case 'Shapes':
                return <ShapeProperties properties={element.properties} onUpdate={handleUpdateProperties} />;
            case 'Marquee':
                return <MarqueeProperties properties={element.properties} onUpdate={handleUpdateProperties} />;
            case 'Weather':
                return <WeatherProperties properties={element.properties} onUpdate={handleUpdateProperties} />;
            case 'Time/Date':
                return <TimeDateProperties properties={element.properties} onUpdate={handleUpdateProperties} />;
            case 'RSS Feed':
                return <RSSFeedProperties properties={element.properties} onUpdate={handleUpdateProperties} />;
            case 'Webpage':
                return <WebpageProperties properties={element.properties} onUpdate={handleUpdateProperties} />;
            case 'QR Code':
                return <QRCodeProperties properties={element.properties} onUpdate={handleUpdateProperties} />;
            default:
                return <p className="p-4 text-xs text-muted-foreground">No specific properties for this element.</p>;
        }
    }

    return (
        <div className="space-y-4 pb-4">
            {/* Alignment Controls */}
            <div className="px-4 pt-2">
                <div className="flex flex-wrap gap-2 items-center justify-between mb-2">
                    <span className="font-semibold text-xs">Align to page:</span>
                    <div className="flex gap-1 flex-wrap">
                        <Button size="sm" variant="outline" className="text-xs h-7 px-2" title="Align Top" onClick={() => alignTo('top')}>Top</Button>
                        <Button size="sm" variant="outline" className="text-xs h-7 px-2" title="Align Middle" onClick={() => alignTo('middle')}>Middle</Button>
                        <Button size="sm" variant="outline" className="text-xs h-7 px-2" title="Align Bottom" onClick={() => alignTo('bottom')}>Bottom</Button>
                        <Button size="sm" variant="outline" className="text-xs h-7 px-2" title="Align Left" onClick={() => alignTo('left')}>Left</Button>
                        <Button size="sm" variant="outline" className="text-xs h-7 px-2" title="Align Center" onClick={() => alignTo('center')}>Center</Button>
                        <Button size="sm" variant="outline" className="text-xs h-7 px-2" title="Align Right" onClick={() => alignTo('right')}>Right</Button>
                    </div>
                </div>
            </div>

            <div className="p-4">
                <h3 className="font-semibold text-sm mb-2">{element.type} Properties</h3>
                <Separator />
            </div>

            <div className="px-4">
                <Accordion type="single" collapsible defaultValue="transform" className="w-full">
                    <AccordionItem value="transform">
                        <AccordionTrigger className="font-semibold text-xs">Transform</AccordionTrigger>
                        <AccordionContent>
                            <CommonProperties element={element} onUpdate={handleUpdateElement} />
                        </AccordionContent>
                    </AccordionItem>
                </Accordion>
            </div>

            <div className="px-4">
                {renderElementProperties()}
            </div>

            <div className="px-4 pt-4 mt-auto">
                <Separator />
                <Button variant="destructive" className="w-full mt-4 text-xs" onClick={onDelete}>
                    <Trash2 className="mr-2 h-4 w-4" />
                    Delete Element
                </Button>
            </div>
        </div>
    );
}

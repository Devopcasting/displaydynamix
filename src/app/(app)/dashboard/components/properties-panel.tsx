
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

interface PropertiesPanelProps {
    element: CanvasElement | null;
    onUpdate: (id: number, updates: Partial<CanvasElement>) => void;
    onDelete: () => void;
    isReadOnly?: boolean;
}

export default function PropertiesPanel({ element, onUpdate, onDelete, isReadOnly = false }: PropertiesPanelProps) {
    if (isReadOnly) {
        return (
            <div className="p-4 text-center text-muted-foreground py-10">
                <p>Viewing in read-only mode.</p>
                <p className="text-xs mt-2">Editing properties is disabled for your role.</p>
            </div>
        )
    }

    if (!element) {
        return (
            <div className="p-4 text-center text-muted-foreground py-10">
                <p>Select an element on the canvas to edit its properties.</p>
            </div>
        );
    }

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
            default:
                return <p className="p-4 text-sm text-muted-foreground">No specific properties for this element.</p>;
        }
    }

    return (
        <div className="space-y-4 pb-4">
            <div className="p-4">
                <h3 className="font-semibold text-lg mb-2">{element.type} Properties</h3>
                <Separator />
            </div>

            <div className="px-4">
                <Accordion type="single" collapsible defaultValue="transform" className="w-full">
                    <AccordionItem value="transform">
                        <AccordionTrigger className="font-semibold text-base">Transform</AccordionTrigger>
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
                <Button variant="destructive" className="w-full mt-4" onClick={onDelete}>
                    <Trash2 className="mr-2" />
                    Delete Element
                </Button>
            </div>
        </div>
    );
}

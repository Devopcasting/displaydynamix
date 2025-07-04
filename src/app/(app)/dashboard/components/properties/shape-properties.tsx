
'use client';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { ShapePreview } from '../shape-preview';
import { cn } from '@/lib/utils';
import type { CanvasElement } from '../../page';

interface ShapePropertiesProps {
    properties: CanvasElement['properties'];
    onUpdate: (updates: Partial<CanvasElement['properties']>) => void;
}

const shapeTypes = ['rectangle', 'ellipse', 'triangle', 'star'] as const;

export default function ShapeProperties({ properties, onUpdate }: ShapePropertiesProps) {
    return (
        <div className="space-y-4">
            <div>
                <Label>Shape Type</Label>
                <div className="grid grid-cols-4 gap-2 pt-2">
                    {shapeTypes.map(shape => (
                        <button
                            key={shape}
                            onClick={() => onUpdate({ shape })}
                            className={cn(
                                "flex flex-col items-center justify-center p-2 border-2 rounded-md hover:border-primary transition-colors",
                                properties.shape === shape ? 'border-primary' : 'border-border'
                            )}
                            title={shape.charAt(0).toUpperCase() + shape.slice(1)}
                        >
                            <div className="h-10 w-10 flex items-center justify-center">
                                <ShapePreview type={shape} />
                            </div>
                        </button>
                    ))}
                </div>
            </div>
            <div>
                <Label>Color</Label>
                <Input type="color" value={properties.color || '#000000'} onChange={e => onUpdate({ color: e.target.value })} className="h-10" />
            </div>
        </div>
    );
}

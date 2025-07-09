'use client';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import type { CanvasElement } from '../../page';

interface CommonPropertiesProps {
    element: CanvasElement;
    onUpdate: (updates: Partial<CanvasElement>) => void;
}

export default function CommonProperties({ element, onUpdate }: CommonPropertiesProps) {
    return (
        <div className="space-y-4 pt-2">
            <div className="grid grid-cols-2 gap-4">
                <div>
                    <Label className="text-xs">X Position</Label>
                    <Input className="text-xs h-8" type="number" value={Math.round(element.x)} onChange={e => onUpdate({ x: parseInt(e.target.value, 10) || 0 })} />
                </div>
                <div>
                    <Label className="text-xs">Y Position</Label>
                    <Input className="text-xs h-8" type="number" value={Math.round(element.y)} onChange={e => onUpdate({ y: parseInt(e.target.value, 10) || 0 })} />
                </div>
            </div>
             <div className="grid grid-cols-2 gap-4">
                <div>
                    <Label className="text-xs">Width</Label>
                    <Input className="text-xs h-8" type="number" value={Math.round(element.width)} onChange={e => onUpdate({ width: parseInt(e.target.value, 10) || 0 })} />
                </div>
                <div>
                    <Label className="text-xs">Height</Label>
                    <Input className="text-xs h-8" type="number" value={Math.round(element.height)} onChange={e => onUpdate({ height: parseInt(e.target.value, 10) || 0 })} />
                </div>
            </div>
        </div>
    );
}

'use client';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import type { CanvasElement } from '../../page';

interface ShapePropertiesProps {
    properties: CanvasElement['properties'];
    onUpdate: (updates: Partial<CanvasElement['properties']>) => void;
}

export default function ShapeProperties({ properties, onUpdate }: ShapePropertiesProps) {
    return (
        <div className="space-y-4">
            <div>
                <Label>Shape Type</Label>
                <Select value={properties.shape || 'rectangle'} onValueChange={value => onUpdate({ shape: value })}>
                    <SelectTrigger>
                        <SelectValue placeholder="Select shape" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="rectangle">Rectangle</SelectItem>
                        <SelectItem value="ellipse">Ellipse</SelectItem>
                        <SelectItem value="triangle">Triangle</SelectItem>
                        <SelectItem value="star">Star</SelectItem>
                    </SelectContent>
                </Select>
            </div>
            <div>
                <Label>Color</Label>
                <Input type="color" value={properties.color || '#000000'} onChange={e => onUpdate({ color: e.target.value })} className="h-10" />
            </div>
        </div>
    );
}

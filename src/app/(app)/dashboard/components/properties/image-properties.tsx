'use client';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import type { CanvasElement } from '../../page';

interface ImagePropertiesProps {
    properties: CanvasElement['properties'];
    onUpdate: (updates: Partial<CanvasElement['properties']>) => void;
}

export default function ImageProperties({ properties, onUpdate }: ImagePropertiesProps) {
    return (
        <div className="space-y-4">
            <div>
                <Label>Image URL</Label>
                <Input value={properties.src || ''} onChange={e => onUpdate({ src: e.target.value })} />
            </div>
            <div>
                <Label>Object Fit</Label>
                <Select value={properties.objectFit || 'cover'} onValueChange={value => onUpdate({ objectFit: value })}>
                    <SelectTrigger>
                        <SelectValue placeholder="Select fit" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="cover">Cover</SelectItem>
                        <SelectItem value="contain">Contain</SelectItem>
                        <SelectItem value="fill">Fill</SelectItem>
                    </SelectContent>
                </Select>
            </div>
        </div>
    );
}

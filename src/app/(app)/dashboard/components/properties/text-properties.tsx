'use client';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import type { CanvasElement } from '../../page';

interface TextPropertiesProps {
    properties: CanvasElement['properties'];
    onUpdate: (updates: Partial<CanvasElement['properties']>) => void;
}

export default function TextProperties({ properties, onUpdate }: TextPropertiesProps) {
    return (
        <div className="space-y-4">
            <div>
                <Label>Content</Label>
                <Textarea value={properties.content || ''} onChange={e => onUpdate({ content: e.target.value })} rows={3} />
            </div>
            <div className="grid grid-cols-2 gap-4">
                <div>
                    <Label>Font Size</Label>
                    <Input type="number" value={properties.fontSize || 16} onChange={e => onUpdate({ fontSize: parseInt(e.target.value, 10) || 16 })} />
                </div>
                <div>
                    <Label>Color</Label>
                    <Input type="color" value={properties.color || '#000000'} onChange={e => onUpdate({ color: e.target.value })} className="h-10" />
                </div>
            </div>
        </div>
    );
}

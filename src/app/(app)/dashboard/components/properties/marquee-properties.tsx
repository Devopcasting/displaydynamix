'use client';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Slider } from '@/components/ui/slider';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import type { CanvasElement } from '../../page';

interface MarqueePropertiesProps {
    properties: CanvasElement['properties'];
    onUpdate: (updates: Partial<CanvasElement['properties']>) => void;
}

export default function MarqueeProperties({ properties, onUpdate }: MarqueePropertiesProps) {
    return (
        <div className="space-y-4">
            <div>
                <Label className="text-xs">Content</Label>
                <Textarea value={properties.content || ''} onChange={e => onUpdate({ content: e.target.value })} rows={3} />
            </div>
            <div className="grid grid-cols-2 gap-4">
                <div>
                    <Label className="text-xs">Font Size</Label>
                    <Input type="number" value={properties.fontSize || 16} onChange={e => onUpdate({ fontSize: parseInt(e.target.value, 10) || 16 })} />
                </div>
                <div>
                    <Label className="text-xs">Color</Label>
                    <Input type="color" value={properties.color || '#000000'} onChange={e => onUpdate({ color: e.target.value })} className="h-10" />
                </div>
            </div>
            <div className="flex gap-4">
                <div className="flex items-center space-x-2">
                    <Checkbox
                        id="marquee-bold"
                        checked={properties.bold || false}
                        onCheckedChange={(checked) => onUpdate({ bold: checked })}
                    />
                    <Label htmlFor="marquee-bold" className="text-xs font-normal">Bold</Label>
                </div>
                <div className="flex items-center space-x-2">
                    <Checkbox
                        id="marquee-italic"
                        checked={properties.italic || false}
                        onCheckedChange={(checked) => onUpdate({ italic: checked })}
                    />
                    <Label htmlFor="marquee-italic" className="text-xs font-normal">Italic</Label>
                </div>
            </div>
            <div>
                <Label>Direction</Label>
                <Select value={properties.direction || 'rtl'} onValueChange={value => onUpdate({ direction: value })}>
                    <SelectTrigger>
                        <SelectValue placeholder="Select direction" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="rtl">Right to Left</SelectItem>
                        <SelectItem value="ltr">Left to Right</SelectItem>
                    </SelectContent>
                </Select>
            </div>
            <div>
                <Label>Speed ({properties.speed || 5})</Label>
                <Slider
                    min={1}
                    max={10}
                    step={1}
                    value={[properties.speed || 5]}
                    onValueChange={value => onUpdate({ speed: value[0] })}
                />
            </div>
        </div>
    );
}

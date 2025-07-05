'use client';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import type { CanvasElement } from '../../page';

interface WeatherPropertiesProps {
    properties: CanvasElement['properties'];
    onUpdate: (updates: Partial<CanvasElement['properties']>) => void;
}

export default function WeatherProperties({ properties, onUpdate }: WeatherPropertiesProps) {
    return (
        <div className="space-y-4">
            <div>
                <Label>Location</Label>
                <Input 
                    placeholder="e.g., London, UK"
                    value={properties.location || ''} 
                    onChange={e => onUpdate({ location: e.target.value })} 
                />
            </div>
            <div>
                <Label>Units</Label>
                <Select value={properties.units || 'metric'} onValueChange={value => onUpdate({ units: value })}>
                    <SelectTrigger>
                        <SelectValue placeholder="Select units" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="metric">Celsius</SelectItem>
                        <SelectItem value="imperial">Fahrenheit</SelectItem>
                    </SelectContent>
                </Select>
            </div>
        </div>
    );
}

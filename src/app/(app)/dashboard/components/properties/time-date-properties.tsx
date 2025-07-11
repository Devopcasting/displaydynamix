"use client";

import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";

interface TimeDatePropertiesProps {
    properties: {
        showTime?: boolean;
        showDate?: boolean;
        timeFormat?: string;
        dateFormat?: string;
        fontSize?: number;
        color?: string;
        bold?: boolean;
        italic?: boolean;
        timeZone?: string;
    };
    onUpdate: (updates: any) => void;
}

export default function TimeDateProperties({ properties, onUpdate }: TimeDatePropertiesProps) {
    return (
        <div className="space-y-4">
            <div>
                <h4 className="font-medium mb-3">Display Options</h4>
                <div className="space-y-3">
                    <div className="flex items-center justify-between">
                        <Label htmlFor="showTime" className="text-sm">Show Time</Label>
                        <Switch
                            id="showTime"
                            checked={properties.showTime ?? true}
                            onCheckedChange={(checked) => onUpdate({ showTime: checked })}
                        />
                    </div>
                    <div className="flex items-center justify-between">
                        <Label htmlFor="showDate" className="text-sm">Show Date</Label>
                        <Switch
                            id="showDate"
                            checked={properties.showDate ?? true}
                            onCheckedChange={(checked) => onUpdate({ showDate: checked })}
                        />
                    </div>
                </div>
            </div>

            <Separator />

            <div>
                <h4 className="font-medium mb-3">Time Format</h4>
                <div className="space-y-3">
                    <div>
                        <Label htmlFor="timeFormat" className="text-sm">Format</Label>
                        <Select
                            value={properties.timeFormat || '12'}
                            onValueChange={(value) => onUpdate({ timeFormat: value })}
                        >
                            <SelectTrigger>
                                <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="12">12-hour (AM/PM)</SelectItem>
                                <SelectItem value="24">24-hour</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                    <div>
                        <Label htmlFor="timeZone" className="text-sm">Time Zone</Label>
                        <Select
                            value={properties.timeZone || 'local'}
                            onValueChange={(value) => onUpdate({ timeZone: value })}
                        >
                            <SelectTrigger>
                                <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="local">Local Time</SelectItem>
                                <SelectItem value="UTC">UTC</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                </div>
            </div>

            <Separator />

            <div>
                <h4 className="font-medium mb-3">Date Format</h4>
                <div>
                    <Label htmlFor="dateFormat" className="text-sm">Format</Label>
                    <Select
                        value={properties.dateFormat || 'short'}
                        onValueChange={(value) => onUpdate({ dateFormat: value })}
                    >
                        <SelectTrigger>
                            <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="short">Short (Mon, Jan 15)</SelectItem>
                            <SelectItem value="long">Long (Monday, January 15, 2024)</SelectItem>
                            <SelectItem value="numeric">Numeric (01/15/2024)</SelectItem>
                        </SelectContent>
                    </Select>
                </div>
            </div>

            <Separator />

            <div>
                <h4 className="font-medium mb-3">Styling</h4>
                <div className="space-y-3">
                    <div>
                        <Label htmlFor="fontSize" className="text-xs">Font Size</Label>
                        <Input
                            id="fontSize"
                            type="number"
                            value={properties.fontSize || 24}
                            onChange={(e) => onUpdate({ fontSize: parseInt(e.target.value) || 24 })}
                            min="8"
                            max="100"
                        />
                    </div>
                    <div>
                        <Label htmlFor="color" className="text-xs">Color</Label>
                        <Input
                            id="color"
                            type="color"
                            value={properties.color || '#000000'}
                            onChange={(e) => onUpdate({ color: e.target.value })}
                        />
                    </div>
                    <div className="flex items-center justify-between">
                        <Label htmlFor="bold" className="text-xs">Bold</Label>
                        <Switch
                            id="bold"
                            checked={properties.bold || false}
                            onCheckedChange={(checked) => onUpdate({ bold: checked })}
                        />
                    </div>
                    <div className="flex items-center justify-between">
                        <Label htmlFor="italic" className="text-xs">Italic</Label>
                        <Switch
                            id="italic"
                            checked={properties.italic || false}
                            onCheckedChange={(checked) => onUpdate({ italic: checked })}
                        />
                    </div>
                </div>
            </div>
        </div>
    );
} 
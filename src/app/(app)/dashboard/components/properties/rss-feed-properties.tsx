"use client";

import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";

interface RSSFeedPropertiesProps {
    properties: {
        feedUrl?: string;
        maxItems?: number;
        showTitle?: boolean;
        showDescription?: boolean;
        showDate?: boolean;
        autoRotate?: boolean;
        rotationSpeed?: number;
        fontSize?: number;
        color?: string;
        backgroundColor?: string;
        bold?: boolean;
        italic?: boolean;
        textAlign?: string;
    };
    onUpdate: (updates: any) => void;
}

export default function RSSFeedProperties({ properties, onUpdate }: RSSFeedPropertiesProps) {
    return (
        <div className="space-y-4">
            <div>
                <h4 className="font-medium mb-3">Feed Configuration</h4>
                <div className="space-y-3">
                    <div>
                        <Label htmlFor="feedUrl" className="text-sm">RSS Feed URL</Label>
                        <Input
                            id="feedUrl"
                            value={properties.feedUrl || ''}
                            onChange={(e) => onUpdate({ feedUrl: e.target.value })}
                            placeholder="https://example.com/feed.xml"
                        />
                        <p className="text-xs text-muted-foreground mt-1">
                            Enter a valid RSS feed URL
                        </p>
                    </div>
                    <div>
                        <Label htmlFor="maxItems" className="text-sm">Maximum Items</Label>
                        <Input
                            id="maxItems"
                            type="number"
                            value={properties.maxItems || 5}
                            onChange={(e) => onUpdate({ maxItems: parseInt(e.target.value) || 5 })}
                            min="1"
                            max="20"
                        />
                    </div>
                </div>
            </div>

            <Separator />

            <div>
                <h4 className="font-medium mb-3">Display Options</h4>
                <div className="space-y-3">
                    <div className="flex items-center justify-between">
                        <Label htmlFor="showTitle" className="text-sm">Show Feed Title</Label>
                        <Switch
                            id="showTitle"
                            checked={properties.showTitle ?? true}
                            onCheckedChange={(checked) => onUpdate({ showTitle: checked })}
                        />
                    </div>
                    <div className="flex items-center justify-between">
                        <Label htmlFor="showDescription" className="text-sm">Show Description</Label>
                        <Switch
                            id="showDescription"
                            checked={properties.showDescription ?? true}
                            onCheckedChange={(checked) => onUpdate({ showDescription: checked })}
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
                <h4 className="font-medium mb-3">Rotation Settings</h4>
                <div className="space-y-3">
                    <div className="flex items-center justify-between">
                        <Label htmlFor="autoRotate" className="text-sm">Auto Rotate Items</Label>
                        <Switch
                            id="autoRotate"
                            checked={properties.autoRotate ?? true}
                            onCheckedChange={(checked) => onUpdate({ autoRotate: checked })}
                        />
                    </div>
                    <div>
                        <Label htmlFor="rotationSpeed" className="text-sm">Rotation Speed (seconds)</Label>
                        <Input
                            id="rotationSpeed"
                            type="number"
                            value={properties.rotationSpeed || 5}
                            onChange={(e) => onUpdate({ rotationSpeed: parseInt(e.target.value) || 5 })}
                            min="2"
                            max="60"
                        />
                    </div>
                </div>
            </div>

            <Separator />

            <div>
                <h4 className="font-medium mb-3">Styling</h4>
                <div className="space-y-3">
                    <div>
                        <Label htmlFor="fontSize" className="text-sm">Font Size</Label>
                        <Input
                            id="fontSize"
                            type="number"
                            value={properties.fontSize || 16}
                            onChange={(e) => onUpdate({ fontSize: parseInt(e.target.value) || 16 })}
                            min="8"
                            max="100"
                        />
                    </div>
                    <div>
                        <Label htmlFor="color" className="text-sm">Text Color</Label>
                        <Input
                            id="color"
                            type="color"
                            value={properties.color || '#000000'}
                            onChange={(e) => onUpdate({ color: e.target.value })}
                        />
                    </div>
                    <div>
                        <Label htmlFor="backgroundColor" className="text-sm">Background Color</Label>
                        <Input
                            id="backgroundColor"
                            type="color"
                            value={properties.backgroundColor || '#ffffff'}
                            onChange={(e) => onUpdate({ backgroundColor: e.target.value })}
                        />
                    </div>
                    <div>
                        <Label htmlFor="textAlign" className="text-sm">Text Alignment</Label>
                        <Select
                            value={properties.textAlign || 'left'}
                            onValueChange={(value) => onUpdate({ textAlign: value })}
                        >
                            <SelectTrigger>
                                <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="left">Left</SelectItem>
                                <SelectItem value="center">Center</SelectItem>
                                <SelectItem value="right">Right</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                    <div className="flex items-center justify-between">
                        <Label htmlFor="bold" className="text-sm">Bold</Label>
                        <Switch
                            id="bold"
                            checked={properties.bold || false}
                            onCheckedChange={(checked) => onUpdate({ bold: checked })}
                        />
                    </div>
                    <div className="flex items-center justify-between">
                        <Label htmlFor="italic" className="text-sm">Italic</Label>
                        <Switch
                            id="italic"
                            checked={properties.italic || false}
                            onCheckedChange={(checked) => onUpdate({ italic: checked })}
                        />
                    </div>
                </div>
            </div>

            <Separator />

            <div>
                <h4 className="font-medium mb-3">Sample RSS Feeds</h4>
                <div className="space-y-2">
                    <p className="text-xs text-muted-foreground">
                        Try these popular RSS feeds:
                    </p>
                    <div className="space-y-1">
                        <button
                            type="button"
                            className="text-xs text-blue-600 hover:underline block"
                            onClick={() => onUpdate({ feedUrl: 'https://feeds.bbci.co.uk/news/rss.xml' })}
                        >
                            BBC News
                        </button>
                        <button
                            type="button"
                            className="text-xs text-blue-600 hover:underline block"
                            onClick={() => onUpdate({ feedUrl: 'https://rss.cnn.com/rss/edition.rss' })}
                        >
                            CNN News
                        </button>
                        <button
                            type="button"
                            className="text-xs text-blue-600 hover:underline block"
                            onClick={() => onUpdate({ feedUrl: 'https://feeds.reuters.com/reuters/topNews' })}
                        >
                            Reuters Top News
                        </button>
                        <button
                            type="button"
                            className="text-xs text-blue-600 hover:underline block"
                            onClick={() => onUpdate({ feedUrl: 'https://feeds.npr.org/1001/rss.xml' })}
                        >
                            NPR News
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
} 
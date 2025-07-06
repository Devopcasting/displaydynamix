'use client';

import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Switch } from '@/components/ui/switch';
import { Separator } from '@/components/ui/separator';
import { Globe, RefreshCw, Monitor, Scroll } from 'lucide-react';

interface WebpagePropertiesProps {
    properties: {
        url?: string;
        allowFullscreen?: boolean;
        showScrollbars?: boolean;
        refreshInterval?: number;
        backgroundColor?: string;
    };
    onUpdate: (updates: Partial<{ [key: string]: any }>) => void;
}

export default function WebpageProperties({ properties, onUpdate }: WebpagePropertiesProps) {
    const {
        url = '',
        allowFullscreen = false,
        showScrollbars = true,
        refreshInterval = 0,
        backgroundColor = 'transparent'
    } = properties;

    return (
        <div className="space-y-4">
            <div className="flex items-center gap-2">
                <Globe className="w-4 h-4" />
                <h3 className="font-semibold">Webpage Settings</h3>
            </div>

            <div className="space-y-2">
                <Label htmlFor="webpage-url">URL</Label>
                <Input
                    id="webpage-url"
                    type="url"
                    placeholder="https://example.com"
                    value={url}
                    onChange={(e) => onUpdate({ url: e.target.value })}
                />
                <p className="text-xs text-muted-foreground">
                    Enter a valid URL starting with http:// or https://
                </p>
            </div>

            <Separator />

            <div className="space-y-2">
                <Label className="flex items-center gap-2">
                    <Monitor className="w-4 h-4" />
                    Display Options
                </Label>

                <div className="flex items-center justify-between">
                    <Label htmlFor="allow-fullscreen" className="text-sm">
                        Allow Fullscreen
                    </Label>
                    <Switch
                        id="allow-fullscreen"
                        checked={allowFullscreen}
                        onCheckedChange={(checked) => onUpdate({ allowFullscreen: checked })}
                    />
                </div>

                <div className="flex items-center justify-between">
                    <Label htmlFor="show-scrollbars" className="text-sm flex items-center gap-1">
                        <Scroll className="w-3 h-3" />
                        Show Scrollbars
                    </Label>
                    <Switch
                        id="show-scrollbars"
                        checked={showScrollbars}
                        onCheckedChange={(checked) => onUpdate({ showScrollbars: checked })}
                    />
                </div>
            </div>

            <Separator />

            <div className="space-y-2">
                <Label className="flex items-center gap-2">
                    <RefreshCw className="w-4 h-4" />
                    Auto-Refresh
                </Label>

                <div className="space-y-2">
                    <Input
                        type="number"
                        min="0"
                        max="3600"
                        placeholder="0"
                        value={refreshInterval}
                        onChange={(e) => onUpdate({ refreshInterval: parseInt(e.target.value) || 0 })}
                    />
                    <p className="text-xs text-muted-foreground">
                        Refresh interval in seconds (0 = no auto-refresh, max 3600)
                    </p>
                </div>
            </div>

            <Separator />

            <div className="space-y-2">
                <Label htmlFor="background-color">Background Color</Label>
                <div className="flex gap-2">
                    <Input
                        id="background-color"
                        type="text"
                        placeholder="transparent"
                        value={backgroundColor}
                        onChange={(e) => onUpdate({ backgroundColor: e.target.value })}
                    />
                    <Input
                        type="color"
                        value={backgroundColor === 'transparent' ? '#ffffff' : backgroundColor}
                        onChange={(e) => onUpdate({ backgroundColor: e.target.value })}
                        className="w-12"
                    />
                </div>
                <p className="text-xs text-muted-foreground">
                    Use "transparent" for no background or enter a color value
                </p>
            </div>

            <Separator />

            <div className="p-3 bg-muted rounded-lg">
                <h4 className="font-medium text-sm mb-2">Example URLs</h4>
                <div className="space-y-1 text-xs text-muted-foreground">
                    <p>• https://example.com</p>
                    <p>• https://news.ycombinator.com</p>
                    <p>• https://weather.com</p>
                    <p>• https://github.com</p>
                    <p>• https://stackoverflow.com</p>
                </div>
            </div>

            <div className="p-3 bg-blue-50 dark:bg-blue-950/20 rounded-lg">
                <h4 className="font-medium text-sm mb-2 text-blue-700 dark:text-blue-300">Security Note</h4>
                <p className="text-xs text-blue-600 dark:text-blue-400">
                    Some websites may block iframe embedding due to security policies.
                    If a webpage doesn't load, try a different URL or check the website's embedding policy.
                </p>
            </div>
        </div>
    );
} 
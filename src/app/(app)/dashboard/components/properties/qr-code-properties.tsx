'use client';

import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';

interface QRCodePropertiesProps {
    properties: {
        content?: string;
        size?: number;
        foregroundColor?: string;
        backgroundColor?: string;
        errorCorrectionLevel?: 'L' | 'M' | 'Q' | 'H';
        format?: 'url' | 'text' | 'email' | 'phone' | 'wifi' | 'vcard';
        email?: string;
        subject?: string;
        body?: string;
        phone?: string;
        ssid?: string;
        password?: string;
        encryption?: 'WEP' | 'WPA' | 'WPA2' | 'nopass';
        name?: string;
        company?: string;
        title?: string;
        address?: string;
    };
    onUpdate: (updates: any) => void;
}

export default function QRCodeProperties({ properties, onUpdate }: QRCodePropertiesProps) {
    const {
        content = '',
        size = 200,
        foregroundColor = '#000000',
        backgroundColor = '#FFFFFF',
        errorCorrectionLevel = 'M',
        format = 'text',
        email = '',
        subject = '',
        body = '',
        phone = '',
        ssid = '',
        password = '',
        encryption = 'nopass',
        name = '',
        company = '',
        title = '',
        address = ''
    } = properties;

    const handleFormatChange = (newFormat: string) => {
        onUpdate({ format: newFormat });
        // Clear format-specific fields when changing format
        onUpdate({
            email: '',
            subject: '',
            body: '',
            phone: '',
            ssid: '',
            password: '',
            encryption: 'nopass',
            name: '',
            company: '',
            title: '',
            address: ''
        });
    };

    const generateQRContent = () => {
        switch (format) {
            case 'url':
                return content.startsWith('http') ? content : `https://${content}`;
            case 'email':
                const emailParams = new URLSearchParams();
                if (subject) emailParams.append('subject', subject);
                if (body) emailParams.append('body', body);
                const emailUrl = `mailto:${email}${emailParams.toString() ? '?' + emailParams.toString() : ''}`;
                return emailUrl;
            case 'phone':
                return `tel:${phone}`;
            case 'wifi':
                const wifiParams = new URLSearchParams();
                wifiParams.append('S', ssid);
                if (password) wifiParams.append('P', password);
                if (encryption !== 'nopass') wifiParams.append('T', encryption);
                return `WIFI:${wifiParams.toString()};;`;
            case 'vcard':
                const vcard = [
                    'BEGIN:VCARD',
                    'VERSION:3.0',
                    `FN:${name}`,
                    `ORG:${company}`,
                    `TITLE:${title}`,
                    `ADR:${address}`,
                    `TEL:${phone}`,
                    `EMAIL:${email}`,
                    'END:VCARD'
                ].filter(line => line.split(':')[1]).join('\n');
                return vcard;
            default:
                return content;
        }
    };

    return (
        <div className="space-y-4">
            <div>
                <Label className="text-xs">QR Code Format</Label>
                <Select value={format} onValueChange={handleFormatChange}>
                    <SelectTrigger>
                        <SelectValue placeholder="Select format" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="text">Plain Text</SelectItem>
                        <SelectItem value="url">URL/Website</SelectItem>
                        <SelectItem value="email">Email</SelectItem>
                        <SelectItem value="phone">Phone Number</SelectItem>
                        <SelectItem value="wifi">WiFi Network</SelectItem>
                        <SelectItem value="vcard">Contact Card</SelectItem>
                    </SelectContent>
                </Select>
            </div>

            <Separator />

            {format === 'text' && (
                <div>
                    <Label className="text-xs">Text Content</Label>
                    <Textarea
                        value={content}
                        onChange={(e) => onUpdate({ content: e.target.value })}
                        placeholder="Enter text to encode in QR code"
                        rows={3}
                    />
                </div>
            )}

            {format === 'url' && (
                <div>
                    <Label className="text-xs">Website URL</Label>
                    <Input
                        value={content}
                        onChange={(e) => onUpdate({ content: e.target.value })}
                        placeholder="https://example.com"
                    />
                </div>
            )}

            {format === 'email' && (
                <div className="space-y-3">
                    <div>
                        <Label className="text-xs">Email Address</Label>
                        <Input
                            value={email}
                            onChange={(e) => onUpdate({ email: e.target.value })}
                            placeholder="user@example.com"
                        />
                    </div>
                    <div>
                        <Label className="text-xs">Subject (Optional)</Label>
                        <Input
                            value={subject}
                            onChange={(e) => onUpdate({ subject: e.target.value })}
                            placeholder="Email subject"
                        />
                    </div>
                    <div>
                        <Label className="text-xs">Message (Optional)</Label>
                        <Textarea
                            value={body}
                            onChange={(e) => onUpdate({ body: e.target.value })}
                            placeholder="Email message"
                            rows={2}
                        />
                    </div>
                </div>
            )}

            {format === 'phone' && (
                <div>
                    <Label className="text-xs">Phone Number</Label>
                    <Input
                        value={phone}
                        onChange={(e) => onUpdate({ phone: e.target.value })}
                        placeholder="+1234567890"
                    />
                </div>
            )}

            {format === 'wifi' && (
                <div className="space-y-3">
                    <div>
                        <Label className="text-xs">Network Name (SSID)</Label>
                        <Input
                            value={ssid}
                            onChange={(e) => onUpdate({ ssid: e.target.value })}
                            placeholder="WiFi network name"
                        />
                    </div>
                    <div>
                        <Label className="text-xs">Password</Label>
                        <Input
                            value={password}
                            onChange={(e) => onUpdate({ password: e.target.value })}
                            placeholder="WiFi password"
                            type="password"
                        />
                    </div>
                    <div>
                        <Label className="text-xs">Encryption Type</Label>
                        <Select value={encryption} onValueChange={(value) => onUpdate({ encryption: value })}>
                            <SelectTrigger>
                                <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="nopass">No Password</SelectItem>
                                <SelectItem value="WEP">WEP</SelectItem>
                                <SelectItem value="WPA">WPA</SelectItem>
                                <SelectItem value="WPA2">WPA2</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                </div>
            )}

            {format === 'vcard' && (
                <div className="space-y-3">
                    <div>
                        <Label className="text-xs">Full Name</Label>
                        <Input
                            value={name}
                            onChange={(e) => onUpdate({ name: e.target.value })}
                            placeholder="John Doe"
                        />
                    </div>
                    <div>
                        <Label className="text-xs">Company</Label>
                        <Input
                            value={company}
                            onChange={(e) => onUpdate({ company: e.target.value })}
                            placeholder="Company Name"
                        />
                    </div>
                    <div>
                        <Label className="text-xs">Job Title</Label>
                        <Input
                            value={title}
                            onChange={(e) => onUpdate({ title: e.target.value })}
                            placeholder="Job Title"
                        />
                    </div>
                    <div>
                        <Label className="text-xs">Phone Number</Label>
                        <Input
                            value={phone}
                            onChange={(e) => onUpdate({ phone: e.target.value })}
                            placeholder="+1234567890"
                        />
                    </div>
                    <div>
                        <Label className="text-xs">Email Address</Label>
                        <Input
                            value={email}
                            onChange={(e) => onUpdate({ email: e.target.value })}
                            placeholder="user@example.com"
                        />
                    </div>
                    <div>
                        <Label className="text-xs">Address</Label>
                        <Textarea
                            value={address}
                            onChange={(e) => onUpdate({ address: e.target.value })}
                            placeholder="Full address"
                            rows={2}
                        />
                    </div>
                </div>
            )}

            <Separator />

            <div>
                <h4 className="font-medium mb-3 text-xs">QR Code Settings</h4>
                <div className="space-y-3">
                    <div>
                        <Label className="text-xs">Size (pixels)</Label>
                        <Input
                            type="number"
                            value={size}
                            onChange={(e) => onUpdate({ size: parseInt(e.target.value) || 200 })}
                            min="50"
                            max="1000"
                        />
                    </div>
                    <div>
                        <Label className="text-xs">Foreground Color</Label>
                        <Input
                            type="color"
                            value={foregroundColor}
                            onChange={(e) => onUpdate({ foregroundColor: e.target.value })}
                        />
                    </div>
                    <div>
                        <Label className="text-xs">Background Color</Label>
                        <Input
                            type="color"
                            value={backgroundColor}
                            onChange={(e) => onUpdate({ backgroundColor: e.target.value })}
                        />
                    </div>
                    <div>
                        <Label className="text-xs">Error Correction Level</Label>
                        <Select value={errorCorrectionLevel} onValueChange={(value) => onUpdate({ errorCorrectionLevel: value })}>
                            <SelectTrigger>
                                <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="L">Low (7%)</SelectItem>
                                <SelectItem value="M">Medium (15%)</SelectItem>
                                <SelectItem value="Q">Quartile (25%)</SelectItem>
                                <SelectItem value="H">High (30%)</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                </div>
            </div>

            <Separator />

            <div className="p-3 bg-muted rounded-lg">
                <h4 className="font-medium text-xs mb-2">Preview</h4>
                <div className="text-xs text-muted-foreground">
                    <p><strong>Content:</strong> {generateQRContent() || 'No content'}</p>
                    <p><strong>Format:</strong> {format}</p>
                    <p><strong>Size:</strong> {size}px</p>
                </div>
            </div>
        </div>
    );
} 
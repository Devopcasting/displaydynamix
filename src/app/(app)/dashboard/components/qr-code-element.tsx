'use client';

import { useEffect, useRef } from 'react';
import { QrCode as QrCodeIcon } from 'lucide-react';

interface QRCodeElementProps {
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
}

export default function QRCodeElement({ properties }: QRCodeElementProps) {
    const canvasRef = useRef<HTMLCanvasElement>(null);
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

    const generateQRCode = async () => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        const qrContent = generateQRContent();
        if (!qrContent) {
            // Show placeholder when no content
            const ctx = canvas.getContext('2d');
            if (ctx) {
                ctx.fillStyle = backgroundColor;
                ctx.fillRect(0, 0, canvas.width, canvas.height);
                ctx.fillStyle = foregroundColor;
                ctx.font = '14px Arial';
                ctx.textAlign = 'center';
                ctx.fillText('No QR content', canvas.width / 2, canvas.height / 2);
            }
            return;
        }

        try {
            // Use a simple QR code generation approach with a public API
            // In a production environment, you'd want to use a proper QR code library
            const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=${size}x${size}&data=${encodeURIComponent(qrContent)}&color=${foregroundColor.replace('#', '')}&bgcolor=${backgroundColor.replace('#', '')}&qzone=1&format=png`;
            
            const img = new Image();
            img.crossOrigin = 'anonymous';
            
            img.onload = () => {
                const ctx = canvas.getContext('2d');
                if (ctx) {
                    // Clear canvas
                    ctx.fillStyle = backgroundColor;
                    ctx.fillRect(0, 0, canvas.width, canvas.height);
                    
                    // Draw QR code
                    ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
                }
            };
            
            img.onerror = () => {
                // Fallback to placeholder if QR generation fails
                const ctx = canvas.getContext('2d');
                if (ctx) {
                    ctx.fillStyle = backgroundColor;
                    ctx.fillRect(0, 0, canvas.width, canvas.height);
                    ctx.fillStyle = foregroundColor;
                    ctx.font = '12px Arial';
                    ctx.textAlign = 'center';
                    ctx.fillText('QR Code', canvas.width / 2, canvas.height / 2 - 10);
                    ctx.fillText('Generation Failed', canvas.width / 2, canvas.height / 2 + 10);
                }
            };
            
            img.src = qrUrl;
        } catch (error) {
            console.error('Failed to generate QR code:', error);
            // Show error placeholder
            const ctx = canvas.getContext('2d');
            if (ctx) {
                ctx.fillStyle = backgroundColor;
                ctx.fillRect(0, 0, canvas.width, canvas.height);
                ctx.fillStyle = foregroundColor;
                ctx.font = '12px Arial';
                ctx.textAlign = 'center';
                ctx.fillText('QR Code Error', canvas.width / 2, canvas.height / 2);
            }
        }
    };

    useEffect(() => {
        generateQRCode();
    }, [properties]);

    const style: React.CSSProperties = {
        width: '100%',
        height: '100%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: backgroundColor,
    };

    // Check if we're in preview mode
    const isPreviewMode = typeof window !== 'undefined' && window.location.pathname === '/preview';

    if (!generateQRContent()) {
        return (
            <div style={style}>
                <div className="flex flex-col items-center justify-center text-center p-4">
                    <QrCodeIcon className="w-8 h-8 mb-2 opacity-50" />
                    <p className="text-sm font-medium">No QR content</p>
                    <p className="text-xs opacity-75">Configure QR code properties</p>
                </div>
            </div>
        );
    }

    return (
        <div style={style}>
            <canvas
                ref={canvasRef}
                width={size}
                height={size}
                style={{
                    maxWidth: '100%',
                    maxHeight: '100%',
                    objectFit: 'contain'
                }}
            />
        </div>
    );
} 
'use client';

import { useState, useEffect } from 'react';
import type { CanvasElement } from '../page';

interface TimeDateElementProps {
    properties: CanvasElement['properties'];
}

export default function TimeDateElement({ properties }: TimeDateElementProps) {
    const [currentTime, setCurrentTime] = useState(new Date());

    useEffect(() => {
        const timer = setInterval(() => {
            setCurrentTime(new Date());
        }, 1000); // Update every second

        return () => clearInterval(timer);
    }, []);

    const {
        showTime = true,
        showDate = true,
        timeFormat = '12', // '12' or '24'
        dateFormat = 'short', // 'short', 'long', 'numeric'
        fontSize = 24,
        color = '#000000',
        bold = false,
        italic = false,
        timeZone = 'local' // 'local' or 'UTC'
    } = properties;

    const formatTime = (date: Date) => {
        if (timeZone === 'UTC') {
            date = new Date(date.getTime() + (date.getTimezoneOffset() * 60000));
        }

        if (timeFormat === '24') {
            return date.toLocaleTimeString('en-US', {
                hour12: false,
                hour: '2-digit',
                minute: '2-digit',
                second: '2-digit'
            });
        } else {
            return date.toLocaleTimeString('en-US', {
                hour12: true,
                hour: 'numeric',
                minute: '2-digit',
                second: '2-digit'
            });
        }
    };

    const formatDate = (date: Date) => {
        if (timeZone === 'UTC') {
            date = new Date(date.getTime() + (date.getTimezoneOffset() * 60000));
        }

        switch (dateFormat) {
            case 'long':
                return date.toLocaleDateString('en-US', {
                    weekday: 'long',
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                });
            case 'numeric':
                return date.toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: '2-digit',
                    day: '2-digit'
                });
            case 'short':
            default:
                return date.toLocaleDateString('en-US', {
                    weekday: 'short',
                    month: 'short',
                    day: 'numeric'
                });
        }
    };

    const style: React.CSSProperties = {
        width: '100%',
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        fontSize: `${fontSize}px`,
        color: color,
        fontWeight: bold ? 'bold' : 'normal',
        fontStyle: italic ? 'italic' : 'normal',
        textAlign: 'center',
        lineHeight: 1.2
    };

    return (
        <div style={style}>
            {showTime && (
                <div style={{ fontSize: `${fontSize * 1.2}px`, fontWeight: 'bold' }}>
                    {formatTime(currentTime)}
                </div>
            )}
            {showDate && (
                <div style={{ fontSize: `${fontSize * 0.8}px`, marginTop: showTime ? '8px' : '0' }}>
                    {formatDate(currentTime)}
                </div>
            )}
        </div>
    );
} 
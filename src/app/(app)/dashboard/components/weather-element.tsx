'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { Loader2, AlertCircle } from 'lucide-react';
import type { CanvasElement } from '../page';

interface WeatherElementProps {
    properties: CanvasElement['properties'];
}

interface WeatherData {
    temp_c: number;
    temp_f: number;
    description: string;
    iconUrl: string;
    city: string;
}

export default function WeatherElement({ properties }: WeatherElementProps) {
    const [weather, setWeather] = useState<WeatherData | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const { location, units } = properties;
    const apiKey = process.env.NEXT_PUBLIC_WEATHERAPI_KEY;

    useEffect(() => {
        if (!location || !apiKey) {
            setError(apiKey ? 'Please provide a location.' : 'WeatherAPI key is not set.');
            setLoading(false);
            setWeather(null);
            return;
        }

        setLoading(true);
        setError(null);
        setWeather(null);

        const fetchWeather = async () => {
            try {
                const response = await fetch(`https://api.weatherapi.com/v1/current.json?key=${apiKey}&q=${location}`);
                if (!response.ok) {
                    const errorData = await response.json();
                    throw new Error(errorData.error?.message || `Error: ${response.status}`);
                }
                const data = await response.json();
                setWeather({
                    temp_c: Math.round(data.current.temp_c),
                    temp_f: Math.round(data.current.temp_f),
                    description: data.current.condition.text,
                    iconUrl: data.current.condition.icon,
                    city: data.location.name,
                });
            } catch (e) {
                setError(e instanceof Error ? e.message : 'Failed to fetch weather data.');
            } finally {
                setLoading(false);
            }
        };

        const timer = setTimeout(fetchWeather, 500); // Debounce API calls
        return () => clearTimeout(timer);

    }, [location, apiKey]);
    
    if (loading) {
        return (
            <div className="w-full h-full flex flex-col items-center justify-center text-muted-foreground">
                <Loader2 className="w-8 h-8 animate-spin" />
                <p className="text-sm mt-2">Loading Weather...</p>
            </div>
        );
    }

    if (error) {
        return (
            <div className="w-full h-full flex flex-col items-center justify-center text-destructive p-2 text-center">
                <AlertCircle className="w-8 h-8 mb-2" />
                <p className="text-sm font-semibold">Weather Error</p>
                <p className="text-xs capitalize">{error}</p>
            </div>
        )
    }

    if (!weather) {
        return null;
    }

    const isMetric = units === 'metric';
    const temp = isMetric ? weather.temp_c : weather.temp_f;
    const tempUnit = isMetric ? 'C' : 'F';

    return (
        <div className="w-full h-full flex flex-col items-center justify-center p-4 text-center text-foreground">
            <Image src={`https:${weather.iconUrl}`} alt={weather.description} width={64} height={64} />
            <p className="text-4xl font-bold mt-2">{temp}°{tempUnit}</p>
            <p className="text-lg capitalize">{weather.description}</p>
            <p className="text-md text-muted-foreground">{weather.city}</p>
        </div>
    );
}

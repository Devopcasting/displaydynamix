'use client';

import { useState, useEffect } from 'react';
import { Sun, Cloud, CloudRain, CloudSnow, CloudLightning, Loader2, AlertCircle } from 'lucide-react';
import type { CanvasElement } from '../page';

interface WeatherElementProps {
    properties: CanvasElement['properties'];
}

interface WeatherData {
    temp: number;
    description: string;
    icon: string;
    city: string;
}

const WeatherIcon = ({ iconCode }: { iconCode: string }) => {
    const iconMapping: { [key: string]: React.ElementType } = {
        '01': Sun, // clear sky
        '02': Cloud, // few clouds
        '03': Cloud, // scattered clouds
        '04': Cloud, // broken clouds
        '09': CloudRain, // shower rain
        '10': CloudRain, // rain
        '11': CloudLightning, // thunderstorm
        '13': CloudSnow, // snow
        '50': Cloud, // mist
    };
    const IconComponent = iconMapping[iconCode.slice(0, 2)] || Sun;
    return <IconComponent className="w-16 h-16" />;
};


export default function WeatherElement({ properties }: WeatherElementProps) {
    const [weather, setWeather] = useState<WeatherData | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const { location, units } = properties;
    const apiKey = process.env.NEXT_PUBLIC_OPENWEATHER_API_KEY;

    useEffect(() => {
        if (!location || !apiKey) {
            setError(apiKey ? 'Please provide a location.' : 'OpenWeather API key is not set.');
            setLoading(false);
            return;
        }

        setLoading(true);
        setError(null);
        setWeather(null);

        const fetchWeather = async () => {
            try {
                const response = await fetch(`https://api.openweathermap.org/data/2.5/weather?q=${location}&units=${units}&appid=${apiKey}`);
                if (!response.ok) {
                    const errorData = await response.json();
                    throw new Error(errorData.message || `Error: ${response.status}`);
                }
                const data = await response.json();
                setWeather({
                    temp: Math.round(data.main.temp),
                    description: data.weather[0].description,
                    icon: data.weather[0].icon,
                    city: data.name,
                });
            } catch (e) {
                setError(e instanceof Error ? e.message : 'Failed to fetch weather data.');
            } finally {
                setLoading(false);
            }
        };

        const timer = setTimeout(fetchWeather, 500); // Debounce API calls
        return () => clearTimeout(timer);

    }, [location, units, apiKey]);
    
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

    const tempUnit = units === 'metric' ? 'C' : 'F';

    return (
        <div className="w-full h-full flex flex-col items-center justify-center p-4 text-center text-foreground">
            <WeatherIcon iconCode={weather.icon} />
            <p className="text-4xl font-bold mt-2">{weather.temp}°{tempUnit}</p>
            <p className="text-lg capitalize">{weather.description}</p>
            <p className="text-md text-muted-foreground">{weather.city}</p>
        </div>
    );
}

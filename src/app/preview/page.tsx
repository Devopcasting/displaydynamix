'use client';

import { useState, useEffect } from 'react';
import WeatherElement from '../(app)/dashboard/components/weather-element';
import TimeDateElement from '../(app)/dashboard/components/time-date-element';
import RSSFeedElement from '../(app)/dashboard/components/rss-feed-element';
import WebpageElement from '../(app)/dashboard/components/webpage-element';
import QRCodeElement from '../(app)/dashboard/components/qr-code-element';

// This type is a subset of the one in the editor, without the unserializable `icon` property.
export interface PreviewElement {
  id: number;
  type: string;
  iconName?: string; // New field for serialized icon names
  x: number;
  y: number;
  width: number;
  height: number;
  rotation: number;
  properties: { [key: string]: any };
}

const renderElementContent = (element: PreviewElement) => {
  console.log('Rendering element:', element);
  const { type, properties } = element;
  const style: React.CSSProperties = {
    width: '100%',
    height: '100%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  };

  switch (type) {
    case 'Text':
      return <div style={{
        ...style,
        fontSize: properties.fontSize,
        color: properties.color,
        textAlign: 'center',
        whiteSpace: 'pre-wrap',
        wordBreak: 'break-word',
        fontWeight: properties.bold ? 'bold' : 'normal',
        fontStyle: properties.italic ? 'italic' : 'normal'
      }}>{properties.content}</div>;
    case 'Image':
      if (!properties.src || properties.src.trim() === '') {
        return (
          <div style={{ ...style, backgroundColor: 'hsl(var(--muted))', color: 'hsl(var(--muted-foreground))' }}>
            <span className="text-sm">No image selected</span>
          </div>
        );
      }
      return (
        <img
          src={properties.src}
          alt=""
          style={{
            width: '100%',
            height: '100%',
            objectFit: properties.objectFit || 'cover',
          }}
        />
      );
    case 'Video':
      if (!properties.src || properties.src.trim() === '') {
        return (
          <div style={{ ...style, backgroundColor: 'hsl(var(--muted))', color: 'hsl(var(--muted-foreground))' }}>
            <span className="text-sm">No video selected</span>
          </div>
        );
      }
      return (
        <video
          src={properties.src}
          autoPlay={properties.autoplay}
          loop={properties.loop}
          muted={properties.muted}
          controls={properties.controls}
          style={{
            width: '100%',
            height: '100%',
            objectFit: 'cover',
          }}
        />
      );
    case 'Marquee':
      const animationName = `marquee-${element.id}`;
      const animationDuration = 20 / (properties.speed || 5);

      return (
        <div style={{ ...style, overflow: 'hidden' }}>
          <style jsx>{`
            @keyframes ${animationName} {
              0% { transform: translateX(${properties.direction === 'rtl' ? '100%' : '-100%'}); }
              100% { transform: translateX(${properties.direction === 'rtl' ? '-100%' : '100%'}); }
            }
          `}</style>
          <div
            style={{
              ...style,
              whiteSpace: 'nowrap',
              color: properties.color,
              fontSize: properties.fontSize,
              fontWeight: properties.bold ? 'bold' : 'normal',
              fontStyle: properties.italic ? 'italic' : 'normal',
              animation: `${animationName} ${animationDuration}s linear infinite`,
            }}
          >
            {properties.content}
          </div>
        </div>
      );
    case 'Shapes':
      if (properties.shape === 'ellipse') {
        return <div style={{ ...style, backgroundColor: properties.color, borderRadius: '50%' }} />;
      }
      if (properties.shape === 'triangle') {
        return (
          <div style={style}>
            <svg viewBox="0 0 100 100" preserveAspectRatio="none" style={{ width: '100%', height: '100%' }}>
              <polygon points="50,0 100,100 0,100" fill={properties.color} />
            </svg>
          </div>
        );
      }
      if (properties.shape === 'star') {
        return (
          <div style={style}>
            <svg viewBox="0 0 100 100" preserveAspectRatio="none" style={{ width: '100%', height: '100%' }}>
              <polygon points="50,0 61.8,38.2 100,38.2 69.1,61.8 80.9,100 50,76.4 19.1,100 30.9,61.8 0,38.2 38.2,38.2" fill={properties.color} />
            </svg>
          </div>
        );
      }
      return <div style={{ ...style, backgroundColor: properties.color }} />;
    case 'Weather':
      return <WeatherElement properties={properties} />;
    case 'Time/Date':
      return <TimeDateElement properties={properties} />;
    case 'RSS Feed':
      return <RSSFeedElement properties={properties} />;
    case 'Webpage':
      return <WebpageElement properties={properties} />;
    case 'QR Code':
      return <QRCodeElement properties={properties} />;
    default:
      // For unimplemented types like Clock, etc., show a placeholder.
      return (
        <div className="flex w-full h-full items-center justify-center bg-muted text-muted-foreground p-2">
          <span className="text-sm font-medium text-center">{element.type} Preview</span>
        </div>
      );
  }
};


export default function PreviewPage() {
  const [elements, setElements] = useState<PreviewElement[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    try {
      console.log('Preview page loading...');
      const data = localStorage.getItem('canvasPreviewElements');
      console.log('Raw localStorage data:', data);

      if (data) {
        const parsedElements = JSON.parse(data);
        console.log('Parsed elements:', parsedElements);
        setElements(parsedElements);
      } else {
        console.log('No preview data found in localStorage');
      }
    } catch (e) {
      console.error("Failed to load preview data", e);
      setError("Could not load preview data. It might be malformed.");
    }
  }, []);

  if (error) {
    return (
      <div className="flex items-center justify-center w-screen h-screen bg-background">
        <p className="text-destructive">{error}</p>
      </div>
    )
  }

  return (
    <div className="w-screen h-screen bg-background text-foreground">
      {elements.length === 0 ? (
        <div className="flex items-center justify-center w-full h-full">
          <p className="text-muted-foreground">No content to preview.</p>
        </div>
      ) : (
        <div className="relative w-full h-full">
          {(() => {
            console.log('Rendering elements array:', elements);
            return elements.map((el) => {
              console.log('Mapping element:', el);
              return (
                <div key={el.id}
                  style={{
                    position: 'absolute',
                    top: `${el.y}px`,
                    left: `${el.x}px`,
                    width: `${el.width}px`,
                    height: `${el.height}px`,
                    transform: `rotate(${el.rotation || 0}deg)`,
                  }}
                >
                  {renderElementContent(el)}
                </div>
              );
            });
          })()}
        </div>
      )}
    </div>
  );
}

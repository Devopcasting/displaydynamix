'use client';

import { useState, useEffect } from 'react';

// This type is a subset of the one in the editor, without the unserializable `icon` property.
export interface PreviewElement {
  id: number;
  type: string;
  x: number;
  y: number;
  width: number;
  height: number;
  rotation: number;
  properties: { [key:string]: any };
}

const renderElementContent = (element: PreviewElement) => {
    const { type, properties } = element;
    const style: React.CSSProperties = {
      width: '100%',
      height: '100%',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      overflow: 'hidden',
    };

    switch (type) {
      case 'Text':
        return <div style={{ ...style, fontSize: properties.fontSize, color: properties.color, textAlign: 'center', whiteSpace: 'pre-wrap', wordBreak: 'break-word' }}>{properties.content}</div>;
      case 'Image':
        return <img src={properties.src} data-ai-hint="placeholder image" alt="preview" style={{ ...style, objectFit: properties.objectFit || 'cover' }} />;
      case 'Marquee':
        const animationDuration = 20 / (properties.speed || 5);
        const animationName = properties.direction === 'ltr' ? 'marqueeAnimationLtr' : 'marqueeAnimationRtl';
        return (
          <div style={{ width: '100%', height: '100%', overflow: 'hidden', position: 'relative', display: 'flex', alignItems: 'center' }}>
            <style>{`
              @keyframes marqueeAnimationRtl {
                0% { transform: translateX(100%); }
                100% { transform: translateX(-100%); }
              }
              @keyframes marqueeAnimationLtr {
                0% { transform: translateX(-100%); }
                100% { transform: translateX(100%); }
              }
            `}</style>
            <div
              style={{
                position: 'absolute',
                whiteSpace: 'nowrap',
                color: properties.color,
                fontSize: properties.fontSize,
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
              <svg viewBox="0 0 100 100" preserveAspectRatio="none" style={{ width: '100%', height: '100%'}}>
                  <polygon points="50,0 100,100 0,100" fill={properties.color} />
              </svg>
            </div>
          );
        }
        if (properties.shape === 'star') {
          return (
            <div style={style}>
              <svg viewBox="0 0 100 100" preserveAspectRatio="none" style={{ width: '100%', height: '100%'}}>
                  <polygon points="50,0 61.8,38.2 100,38.2 69.1,61.8 80.9,100 50,76.4 19.1,100 30.9,61.8 0,38.2 38.2,38.2" fill={properties.color} />
              </svg>
            </div>
          );
        }
        return <div style={{ ...style, backgroundColor: properties.color }} />;
      default:
        // For unimplemented types like Video, Clock, etc., show a placeholder.
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
            const data = localStorage.getItem('canvasPreviewElements');
            if (data) {
                const parsedElements = JSON.parse(data);
                setElements(parsedElements);
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
                    {elements.map((el) => (
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
                    ))}
                </div>
            )}
        </div>
    );
}

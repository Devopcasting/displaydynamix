'use client';

export const ShapePreview = ({ type }: { type: 'rectangle' | 'ellipse' | 'triangle' | 'star' }) => {
    const style = { fill: 'hsl(var(--muted-foreground))' };
    switch (type) {
      case 'rectangle':
        return (
          <div className="w-full h-full bg-muted-foreground rounded-sm"></div>
        );
      case 'ellipse':
        return (
          <div className="w-full h-full bg-muted-foreground rounded-full"></div>
        );
      case 'triangle':
        return (
            <svg viewBox="0 0 100 100" preserveAspectRatio="contain" className="w-full h-full">
                <polygon points="50,0 100,100 0,100" style={style} />
            </svg>
        );
      case 'star':
        return (
            <svg viewBox="0 0 100 100" preserveAspectRatio="contain" className="w-full h-full">
                <polygon points="50,0 61.8,38.2 100,38.2 69.1,61.8 80.9,100 50,76.4 19.1,100 30.9,61.8 0,38.2 38.2,38.2" style={style} />
            </svg>
        );
      default:
        return null;
    }
  };

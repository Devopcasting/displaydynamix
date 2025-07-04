'use client';

export const LayoutPreview = ({ type }: { type: 'column' | 'row' | 'grid' | 'main-sidebar' }) => {
    switch (type) {
      case 'column':
        return (
          <div className="flex flex-col gap-1 h-full">
            <div className="bg-muted h-1/3 rounded-sm"></div>
            <div className="bg-muted h-1/3 rounded-sm"></div>
            <div className="bg-muted h-1/3 rounded-sm"></div>
          </div>
        );
      case 'row':
        return (
          <div className="flex gap-1 h-full">
            <div className="bg-muted w-1/3 rounded-sm"></div>
            <div className="bg-muted w-1/3 rounded-sm"></div>
            <div className="bg-muted w-1/3 rounded-sm"></div>
          </div>
        );
      case 'grid':
        return (
          <div className="grid grid-cols-2 grid-rows-2 gap-1 h-full">
            <div className="bg-muted rounded-sm"></div>
            <div className="bg-muted rounded-sm"></div>
            <div className="bg-muted rounded-sm"></div>
            <div className="bg-muted rounded-sm"></div>
          </div>
        );
      case 'main-sidebar':
        return (
          <div className="flex gap-1 h-full">
            <div className="bg-muted w-2/3 rounded-sm"></div>
            <div className="flex flex-col gap-1 w-1/3">
              <div className="bg-muted h-full rounded-sm"></div>
              <div className="bg-muted h-full rounded-sm"></div>
            </div>
          </div>
        );
      default:
        return null;
    }
  };

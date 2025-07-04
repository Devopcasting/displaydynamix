
'use client';

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

interface LayoutDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onApplyLayout: (layoutType: 'column' | 'row' | 'grid' | 'main-sidebar') => void;
}

const layouts = [
  { name: "Vertical Stack", type: 'column' as const },
  { name: "Horizontal Row", type: 'row' as const },
  { name: "Grid", type: 'grid' as const },
  { name: "Main with Sidebar", type: 'main-sidebar' as const },
];

const LayoutPreview = ({ type }: { type: 'column' | 'row' | 'grid' | 'main-sidebar' }) => {
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


export default function LayoutDialog({ open, onOpenChange, onApplyLayout }: LayoutDialogProps) {
  const handleSelectLayout = (layoutType: 'column' | 'row' | 'grid' | 'main-sidebar') => {
    onApplyLayout(layoutType);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-3xl">
        <DialogHeader>
          <DialogTitle>Choose a Layout</DialogTitle>
          <DialogDescription>
            Select a layout to automatically arrange the elements on your canvas. This will affect all current elements.
          </DialogDescription>
        </DialogHeader>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 py-4">
          {layouts.map((layout) => (
            <div key={layout.type}
              onClick={() => handleSelectLayout(layout.type)}
              className="cursor-pointer group space-y-2"
            >
              <div className="aspect-video border-2 border-border group-hover:border-primary rounded-lg p-2 transition-colors">
                <LayoutPreview type={layout.type} />
              </div>
              <p className="text-center text-sm font-medium text-muted-foreground group-hover:text-primary transition-colors">
                {layout.name}
              </p>
            </div>
          ))}
        </div>
      </DialogContent>
    </Dialog>
  );
}

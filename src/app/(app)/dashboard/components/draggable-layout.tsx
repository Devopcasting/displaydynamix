
'use client';
import type { FC } from 'react';
import { useDrag } from 'react-dnd';
import { Button } from '@/components/ui/button';
import { ItemTypes } from './draggable-element';
import { LayoutPreview } from './layout-preview';

interface DraggableLayoutProps {
  type: 'column' | 'row' | 'grid' | 'main-sidebar';
  name: string;
  disabled?: boolean;
}

export const DraggableLayout: FC<DraggableLayoutProps> = ({ type, name, disabled }) => {
  const [{ isDragging }, drag] = useDrag(() => ({
    type: ItemTypes.LAYOUT,
    item: { type },
    canDrag: !disabled,
    collect: (monitor) => ({
      isDragging: !!monitor.isDragging(),
    }),
  }));

  return (
    <div
      ref={drag}
      style={{ opacity: isDragging ? 0.5 : 1 }}
      className="cursor-grab group"
      data-disabled={disabled}
      title={name}
    >
      <Button 
        variant="outline" 
        className="flex flex-col h-12 w-12 p-1 pointer-events-none" 
        disabled={disabled}
    >
        <div className="h-6 w-6 mx-auto pointer-events-none">
        <LayoutPreview type={type} />
      </div>
      </Button>
    </div>
  );
};

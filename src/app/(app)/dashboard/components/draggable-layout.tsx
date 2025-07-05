
'use client';
import type { FC } from 'react';
import { useDrag } from 'react-dnd';
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
      className="cursor-grab group space-y-1.5 p-2 border bg-card rounded-lg hover:border-primary hover:shadow-md transition-all data-[disabled=true]:cursor-not-allowed data-[disabled=true]:opacity-50"
      data-disabled={disabled}
    >
      <div className="aspect-video h-12 mx-auto pointer-events-none">
        <LayoutPreview type={type} />
      </div>
      <p className="text-center text-xs font-medium text-muted-foreground group-hover:text-primary transition-colors truncate">
        {name}
      </p>
    </div>
  );
};

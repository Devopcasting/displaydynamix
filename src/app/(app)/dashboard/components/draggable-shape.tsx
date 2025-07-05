
'use client';
import type { FC } from 'react';
import { useDrag } from 'react-dnd';
import { ItemTypes } from './draggable-element';
import { ShapePreview } from './shape-preview';

interface DraggableShapeProps {
  type: 'rectangle' | 'ellipse' | 'triangle' | 'star';
  name: string;
  disabled?: boolean;
}

export const DraggableShape: FC<DraggableShapeProps> = ({ type, name, disabled }) => {
  const [{ isDragging }, drag] = useDrag(() => ({
    type: ItemTypes.SHAPE,
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
      <div className="h-12 w-12 mx-auto pointer-events-none flex items-center justify-center">
        <ShapePreview type={type} />
      </div>
      <p className="text-center text-xs font-medium text-muted-foreground group-hover:text-primary transition-colors truncate">
        {name}
      </p>
    </div>
  );
};

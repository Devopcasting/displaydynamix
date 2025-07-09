
'use client';
import type { FC } from 'react';
import { useDrag } from 'react-dnd';
import { Button } from '@/components/ui/button';
import type { LucideIcon } from 'lucide-react';

export const ItemTypes = {
  ELEMENT: 'element',
  LAYOUT: 'layout',
  SHAPE: 'shape',
};

export interface DraggableElementProps {
  icon: LucideIcon;
  label: string;
  disabled?: boolean;
}

export const DraggableElement: FC<DraggableElementProps> = ({ icon: Icon, label, disabled }) => {
  const [{ isDragging }, drag] = useDrag(() => ({
    type: ItemTypes.ELEMENT,
    item: { type: label, icon: Icon },
    canDrag: !disabled,
    collect: (monitor) => ({
      isDragging: !!monitor.isDragging(),
    }),
  }));

  return (
    <div 
      ref={drag}
      style={{ opacity: isDragging ? 0.5 : 1, cursor: disabled ? 'not-allowed' : 'move' }}
      title={label}
    >
      <Button variant="outline" className="flex flex-col h-12 w-12 p-1 pointer-events-none" disabled={disabled}>
        <Icon className="w-4 h-4" />
      </Button>
    </div>
  );
};

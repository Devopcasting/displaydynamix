'use client';

import { useState, useRef, useCallback, useEffect } from "react";
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { useDrop } from 'react-dnd';
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Type,
  Image as ImageIcon,
  Video,
  Shapes,
  CloudSun,
  Rss,
  Clock,
  Globe,
  QrCode,
  Layers,
  Palette,
  Play,
  Eye,
  Save,
  ZoomIn,
  ZoomOut,
  LucideIcon,
} from "lucide-react";
import AiLayoutSuggestions from "./components/ai-layout-suggestions";
import { DraggableElement, ItemTypes } from "./components/draggable-element";
import PropertiesPanel from "./components/properties-panel";

const elements = [
  { icon: Type, label: "Text" },
  { icon: ImageIcon, label: "Image" },
  { icon: Video, label: "Video" },
  { icon: Shapes, label: "Shapes" },
  { icon: Clock, label: "Time/Date" },
  { icon: CloudSun, label: "Weather" },
  { icon: Rss, label: "RSS Feed" },
  { icon: Globe, label: "Webpage" },
  { icon: QrCode, label: "QR Code" },
];

const tools = [
  { icon: Layers, label: "Layers" },
  { icon: Palette, label: "Colors" },
  { icon: Play, label: "Animations" },
];

export interface CanvasElement {
  id: number;
  type: string;
  icon: LucideIcon;
  x: number;
  y: number;
  width: number;
  height: number;
  rotation: number;
  properties: { [key: string]: any };
}

function Editor() {
  const [canvasElements, setCanvasElements] = useState<CanvasElement[]>([]);
  const [selectedElementId, setSelectedElementId] = useState<number | null>(null);
  const canvasRef = useRef<HTMLDivElement>(null);
  const [isResizing, setIsResizing] = useState(false);
  const [resizingElementId, setResizingElementId] = useState<number | null>(null);

  const updateElement = useCallback((id: number, updates: Partial<CanvasElement>) => {
    setCanvasElements(prev =>
      prev.map(el => (el.id === id ? { ...el, ...updates, properties: { ...el.properties, ...(updates.properties || {}) } } : el))
    );
  }, []);
  
  const selectedElement = canvasElements.find(el => el.id === selectedElementId) || null;

  const getDefaultProperties = (type: string) => {
    switch (type) {
      case 'Text':
        return { content: 'Double-click to edit', fontSize: 24, color: '#000000' };
      case 'Image':
        return { src: 'https://placehold.co/300x200.png', objectFit: 'cover' };
      case 'Shapes':
        return { shape: 'rectangle', color: 'hsl(var(--primary))' };
      default:
        return {};
    }
  };

  const [{ isOver }, drop] = useDrop(
    () => ({
      accept: ItemTypes.ELEMENT,
      drop: (item: { type: string; icon: LucideIcon }, monitor) => {
        const offset = monitor.getClientOffset();
        if (offset && canvasRef.current) {
          const canvasBounds = canvasRef.current.getBoundingClientRect();
          const x = offset.x - canvasBounds.left;
          const y = offset.y - canvasBounds.top;
          
          const newElement: CanvasElement = {
            id: Date.now(),
            type: item.type,
            icon: item.icon,
            x: x - 100, // center the drop
            y: y - 25,
            width: 200,
            height: 50,
            rotation: 0,
            properties: getDefaultProperties(item.type),
          };
          
          setCanvasElements((prev) => [...prev, newElement]);
          setSelectedElementId(newElement.id);
        }
      },
      collect: (monitor) => ({ isOver: !!monitor.isOver() }),
    }),
    [getDefaultProperties]
  );
  
  drop(canvasRef);

  const handleResizeStart = (e: React.MouseEvent, id: number) => {
    e.stopPropagation();
    setIsResizing(true);
    setResizingElementId(id);
  };

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
        if (!isResizing || !resizingElementId || !canvasRef.current) return;
        
        const element = canvasElements.find(el => el.id === resizingElementId);
        const canvasBounds = canvasRef.current.getBoundingClientRect();

        if (!element) return;

        const newWidth = e.clientX - canvasBounds.left - element.x;
        const newHeight = e.clientY - canvasBounds.top - element.y;

        updateElement(resizingElementId, {
            width: Math.max(20, newWidth),
            height: Math.max(20, newHeight)
        });
    };

    const handleMouseUp = () => {
        setIsResizing(false);
        setResizingElementId(null);
    };

    if (isResizing) {
      window.addEventListener('mousemove', handleMouseMove);
      window.addEventListener('mouseup', handleMouseUp);
    }

    return () => {
        window.removeEventListener('mousemove', handleMouseMove);
        window.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isResizing, resizingElementId, canvasElements, updateElement]);

  const renderElementContent = (element: CanvasElement) => {
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
        return <div style={{ ...style, fontSize: properties.fontSize, color: properties.color, textAlign: 'center', whiteSpace: 'pre-wrap', wordBreak: 'break-word' }}>{properties.content}</div>;
      case 'Image':
        return <img src={properties.src} alt="" style={{ ...style, objectFit: properties.objectFit || 'cover' }} />;
      case 'Shapes':
        if (properties.shape === 'ellipse') {
          return <div style={{ ...style, backgroundColor: properties.color, borderRadius: '50%' }} />;
        }
        return <div style={{ ...style, backgroundColor: properties.color }} />;
      default:
        const ElementIcon = element.icon;
        return (
          <div className="flex items-center gap-2 p-2 text-muted-foreground">
              <ElementIcon className="w-6 h-6" />
              <span className="text-sm font-medium">{element.type}</span>
          </div>
        );
    }
  };


  return (
    <div className="flex flex-col h-full bg-muted/40">
      <header className="flex items-center justify-between h-14 px-4 border-b bg-background">
        <h1 className="text-lg font-semibold">Untitled Template</h1>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm">
            <Eye className="mr-2" />
            Preview
          </Button>
          <Button size="sm">
            <Save className="mr-2" />
            Save
          </Button>
        </div>
      </header>
      <main className="flex-1 flex overflow-hidden">
        {/* Left Panel: Elements */}
        <aside className="w-64 border-r bg-background overflow-y-auto">
          <div className="p-4">
            <h2 className="text-md font-semibold mb-4">Elements</h2>
            <div className="grid grid-cols-2 gap-2">
              {elements.map((el) => (
                <DraggableElement key={el.label} label={el.label} icon={el.icon} />
              ))}
            </div>
            <h2 className="text-md font-semibold my-4">Tools</h2>
            <div className="grid grid-cols-2 gap-2">
               {tools.map((tool) => (
                <Button key={tool.label} variant="outline" className="flex flex-col h-20">
                  <tool.icon className="w-6 h-6 mb-1" />
                  <span className="text-xs">{tool.label}</span>
                </Button>
              ))}
            </div>
          </div>
        </aside>

        {/* Center Panel: Canvas */}
        <div className="flex-1 flex flex-col items-center justify-center p-4 overflow-hidden">
            <div className="w-full h-full bg-background shadow-lg rounded-lg border flex items-center justify-center relative">
                <div className="absolute top-2 left-2 flex gap-1">
                    <Button variant="ghost" size="icon"><ZoomIn/></Button>
                    <Button variant="ghost" size="icon"><ZoomOut/></Button>
                </div>
                <div ref={canvasRef} className="w-[80%] h-[80%] border-2 border-dashed relative bg-[linear-gradient(to_right,theme(colors.border)_1px,transparent_1px),linear-gradient(to_bottom,theme(colors.border)_1px,transparent_1px)] bg-[size:2rem_2rem]" style={{ backgroundColor: isOver ? 'hsl(var(--accent)/0.1)' : 'transparent', transition: 'background-color 0.2s' }}
                  onClick={() => setSelectedElementId(null)}
                >
                    {canvasElements.length === 0 && <p className="text-muted-foreground bg-background px-2 rounded-sm absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">Drop elements here</p>}
                    {canvasElements.map((el) => {
                      const isSelected = selectedElementId === el.id;
                      return (
                        <div key={el.id} 
                          onClick={(e) => { e.stopPropagation(); setSelectedElementId(el.id)}}
                          style={{ position: 'absolute', top: `${el.y}px`, left: `${el.x}px`, width: `${el.width}px`, height: `${el.height}px` }} 
                          className="cursor-grab"
                        >
                          <div className="w-full h-full">
                            {renderElementContent(el)}
                          </div>
                          {isSelected && (
                              <>
                                <div className="absolute inset-0 border-2 border-primary pointer-events-none" />
                                <div
                                    className="absolute -bottom-1 -right-1 w-3 h-3 bg-primary rounded-full cursor-se-resize border-2 border-white pointer-events-auto"
                                    onMouseDown={(e) => handleResizeStart(e, el.id)}
                                />
                              </>
                          )}
                        </div>
                      )
                    })}
                </div>
            </div>
        </div>

        {/* Right Panel: Properties & AI */}
        <aside className="w-80 border-l bg-background overflow-y-auto">
          <Tabs defaultValue="properties" className="w-full">
            <TabsList className="w-full grid grid-cols-2">
              <TabsTrigger value="properties">Properties</TabsTrigger>
              <TabsTrigger value="ai">AI Suggestions</TabsTrigger>
            </TabsList>
            <TabsContent value="properties" className="p-0">
              <PropertiesPanel
                element={selectedElement}
                onUpdate={updateElement}
              />
            </TabsContent>
            <TabsContent value="ai" className="p-4">
              <AiLayoutSuggestions />
            </TabsContent>
          </Tabs>
        </aside>
      </main>
    </div>
  );
}


export default function DashboardPage() {
  return (
    <DndProvider backend={HTML5Backend}>
      <Editor />
    </DndProvider>
  )
}

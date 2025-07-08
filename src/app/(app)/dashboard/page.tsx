'use client';

import { useState, useRef, useCallback, useEffect } from "react";
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { useDrop } from 'react-dnd';
import { useAuth } from "@/components/auth-provider";
import { Button } from "@/components/ui/button";
import { apiBaseUrl } from "@/lib/config";
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
  Eye,
  Save,
  ZoomIn,
  ZoomOut,
  LucideIcon,
  Loader2,
  RotateCcw,
  ScrollText,
} from "lucide-react";
import { DraggableElement, ItemTypes } from "./components/draggable-element";
import PropertiesPanel from "./components/properties-panel";
import { DraggableLayout } from "./components/draggable-layout";
import { DraggableShape } from "./components/draggable-shape";
import WeatherElement from "./components/weather-element";
import TimeDateElement from "./components/time-date-element";
import RSSFeedElement from "./components/rss-feed-element";
import WebpageElement from "./components/webpage-element";
import SaveTemplateDialog from "./components/save-template-dialog";

const elements = [
  { icon: Type, label: "Text" },
  { icon: ImageIcon, label: "Image" },
  { icon: ScrollText, label: "Marquee" },
  { icon: Video, label: "Video" },
  { icon: Clock, label: "Time/Date" },
  { icon: CloudSun, label: "Weather" },
  { icon: Rss, label: "RSS Feed" },
  { icon: Globe, label: "Webpage" },
  { icon: QrCode, label: "QR Code" },
];

const shapes = [
  { name: "Rectangle", type: 'rectangle' as const },
  { name: "Ellipse", type: 'ellipse' as const },
  { name: "Triangle", type: 'triangle' as const },
  { name: "Star", type: 'star' as const },
];

const layouts = [
  { name: "Vertical Stack", type: 'column' as const },
  { name: "Horizontal Row", type: 'row' as const },
  { name: "Grid", type: 'grid' as const },
  { name: "Main with Sidebar", type: 'main-sidebar' as const },
];

// Icon mapping for serialization
const iconMap: { [key: string]: LucideIcon } = {
  Type,
  ImageIcon,
  Video,
  Shapes,
  CloudSun,
  Rss,
  Clock,
  Globe,
  QrCode,
  ScrollText,
};

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

// Utility functions for icon serialization
const serializeElement = (element: CanvasElement) => {
  const { icon, ...rest } = element;
  const iconName = Object.keys(iconMap).find(key => iconMap[key] === icon) || 'Type';
  return { ...rest, iconName };
};

const deserializeElement = (elementData: any): CanvasElement => {
  console.log('Deserializing element:', elementData);
  // Handle both old format (icon: {}) and new format (iconName: string)
  let iconName = elementData.iconName;

  // If no iconName but has icon property (old format), try to determine icon from type
  if (!iconName && elementData.icon) {
    // Map element types to icon names
    const typeToIconMap: { [key: string]: string } = {
      'Text': 'Type',
      'Image': 'ImageIcon',
      'Video': 'Video',
      'Marquee': 'ScrollText',
      'Shapes': 'Shapes',
      'Weather': 'CloudSun',
      'Time/Date': 'Clock',
      'RSS Feed': 'Rss',
      'Webpage': 'Globe',
      'QR Code': 'QrCode',
    };
    iconName = typeToIconMap[elementData.type] || 'Type';
  }

  // If still no iconName, determine it from the element type
  if (!iconName) {
    const typeToIconMap: { [key: string]: string } = {
      'Text': 'Type',
      'Image': 'ImageIcon',
      'Video': 'Video',
      'Marquee': 'ScrollText',
      'Shapes': 'Shapes',
      'Weather': 'CloudSun',
      'Time/Date': 'Clock',
      'RSS Feed': 'Rss',
      'Webpage': 'Globe',
      'QR Code': 'QrCode',
    };
    iconName = typeToIconMap[elementData.type] || 'Type';
  }

  const icon = iconMap[iconName] || Type;
  console.log('Assigned icon:', iconName, 'Icon component:', icon);

  // Remove the old icon property if it exists
  const { icon: oldIcon, iconName: _, ...rest } = elementData;
  const result = { ...rest, icon };
  console.log('Deserialized result:', result);
  return result;
};

function Editor() {
  const { user } = useAuth();
  const isReadOnly = user?.role === 'Viewer';

  const [canvasElements, setCanvasElements] = useState<CanvasElement[]>([]);
  const [selectedElementId, setSelectedElementId] = useState<number | null>(null);
  const [pendingLayout, setPendingLayout] = useState<string | null>(null);
  const [isApplyingLayout, setIsApplyingLayout] = useState(false);
  const [templateName, setTemplateName] = useState<string>("Untitled Template");
  const [isLoadingTemplate, setIsLoadingTemplate] = useState<boolean>(false);
  const [showLoadedMessage, setShowLoadedMessage] = useState<boolean>(false);
  const canvasRef = useRef<HTMLDivElement>(null);
  const [dragInfo, setDragInfo] = useState<{
    type: string;
    id: number;
    startX: number;
    startY: number;
    elementStartX: number;
    elementStartY: number;
    elementStartWidth: number;
    elementStartHeight: number;
  } | null>(null);

  const updateElement = useCallback((id: number, updates: Partial<CanvasElement>) => {
    if (isReadOnly) return;
    setCanvasElements(prev =>
      prev.map(el => (el.id === id ? { ...el, ...updates, properties: { ...el.properties, ...(updates.properties || {}) } } : el))
    );
  }, [isReadOnly]);

  const selectedElement = canvasElements.find(el => el.id === selectedElementId) || null;

  const deleteSelectedElement = useCallback(() => {
    if (isReadOnly || !selectedElementId) return;
    setCanvasElements(prev => prev.filter(el => el.id !== selectedElementId));
    setSelectedElementId(null);
  }, [selectedElementId, isReadOnly]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (isReadOnly || !selectedElementId) return;

      const activeEl = document.activeElement;
      if (activeEl && (activeEl.tagName === 'INPUT' || activeEl.tagName === 'TEXTAREA')) {
        return;
      }

      if (e.key === 'Delete' || e.key === 'Backspace') {
        e.preventDefault();
        deleteSelectedElement();
      }
    };

    window.addEventListener('keydown', handleKeyDown);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [selectedElementId, deleteSelectedElement, isReadOnly]);

  const getDefaultProperties = useCallback((type: string) => {
    switch (type) {
      case 'Text':
        return { content: 'Double-click to edit', fontSize: 24, color: '#000000' };
      case 'Image':
        return { src: 'https://placehold.co/300x200.png', objectFit: 'cover' };
      case 'Video':
        return { src: '', autoplay: true, loop: true, muted: true, controls: false };
      case 'Marquee':
        return { content: 'Scrolling text...', fontSize: 24, color: '#000000', speed: 5, direction: 'rtl' };
      case 'Shapes':
        return { shape: 'rectangle', color: 'hsl(var(--primary))' };
      case 'Weather':
        return { location: 'London', units: 'metric' };
      case 'Time/Date':
        return {
          showTime: true,
          showDate: true,
          timeFormat: '12',
          dateFormat: 'short',
          fontSize: 24,
          color: '#000000',
          bold: false,
          italic: false,
          timeZone: 'local'
        };
      case 'RSS Feed':
        return {
          feedUrl: 'https://feeds.bbci.co.uk/news/rss.xml',
          maxItems: 5,
          showTitle: true,
          showDescription: true,
          showDate: true,
          autoRotate: true,
          rotationSpeed: 5,
          fontSize: 16,
          color: '#000000',
          backgroundColor: 'transparent',
          bold: false,
          italic: false,
          textAlign: 'left'
        };
      case 'Webpage':
        return {
          url: '',
          allowFullscreen: false,
          showScrollbars: true,
          refreshInterval: 0,
          backgroundColor: 'transparent'
        };
      default:
        return {};
    }
  }, []);

  const handlePreview = () => {
    console.log('Preview button clicked');
    console.log('Canvas elements before serialization:', canvasElements);

    // Serialize elements for preview
    const serializedElements = canvasElements.map(serializeElement);
    console.log('Serialized elements:', serializedElements);

    localStorage.setItem('canvasPreviewElements', JSON.stringify(serializedElements));
    console.log('Preview data saved to localStorage');

    window.open('/preview', '_blank');
  };

  const handleSaveTemplate = async (templateData: { name: string; description: string }) => {
    const token = localStorage.getItem('auth_token');
    if (!token) {
      throw new Error('Authentication required');
    }

    // Serialize elements for storage
    const serializedElements = canvasElements.map(serializeElement);

    const response = await fetch(`${apiBaseUrl}/templates/`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        name: templateData.name,
        description: templateData.description,
        elements: serializedElements,
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.detail || 'Failed to save template');
    }

    return response.json();
  };

  // Load saved elements or template on component mount
  useEffect(() => {
    // Add a small delay to ensure component is fully mounted
    const timer = setTimeout(() => {
      // Check if there's a template to load
      const loadTemplate = localStorage.getItem('loadTemplate');

      if (loadTemplate) {
        setIsLoadingTemplate(true);
        try {
          const template = JSON.parse(loadTemplate);
          console.log('Loading template:', template);

          // Set template name if available
          if (template.name) {
            setTemplateName(template.name);
          }

          if (template.elements && Array.isArray(template.elements)) {
            console.log('Template elements:', template.elements);
            // Deserialize elements to restore icon components
            try {
              const deserializedElements = template.elements.map((element: any, index: number) => {
                try {
                  return deserializeElement(element);
                } catch (error) {
                  console.error(`Error deserializing element ${index}:`, element, error);
                  return null;
                }
              }).filter(Boolean);
              console.log('Deserialized elements:', deserializedElements);
              setCanvasElements(deserializedElements);
              setShowLoadedMessage(true);
              console.log('Canvas elements set to:', deserializedElements.length, 'elements');
            } catch (error) {
              console.error('Error during deserialization:', error);
              setCanvasElements([]);
            }
          } else {
            console.log('No elements found in template');
            setCanvasElements([]);
          }

          localStorage.removeItem('loadTemplate');
        } catch (error) {
          console.error('Error loading template:', error);
          // Clear invalid data
          localStorage.removeItem('loadTemplate');
          setCanvasElements([]);
        } finally {
          setIsLoadingTemplate(false);
        }
      } else {
        // Only load saved elements if explicitly requested (not on fresh login)
        // For now, start with empty canvas
        setCanvasElements([]);

        // Clear any old preview data to prevent unwanted elements
        localStorage.removeItem('canvasPreviewElements');
      }
    }, 100); // 100ms delay

    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (!pendingLayout) return;

    setIsApplyingLayout(true);

    setTimeout(() => {
      setCanvasElements(currentElements => {
        if (!canvasRef.current) {
          return currentElements;
        }

        let elementsToArrange = [...currentElements];

        if (elementsToArrange.length === 0) {
          elementsToArrange = [
            { id: Date.now() + 1, type: 'Text', icon: Type, x: 0, y: 0, width: 200, height: 100, rotation: 0, properties: getDefaultProperties('Text') },
            { id: Date.now() + 2, type: 'Image', icon: ImageIcon, x: 0, y: 0, width: 200, height: 100, rotation: 0, properties: getDefaultProperties('Image') },
            { id: Date.now() + 3, type: 'Shapes', icon: Shapes, x: 0, y: 0, width: 200, height: 100, rotation: 0, properties: getDefaultProperties('Shapes') },
          ];
        }

        const canvasWidth = canvasRef.current.offsetWidth;
        const canvasHeight = canvasRef.current.offsetHeight;
        const padding = 16;

        const numElements = elementsToArrange.length;
        let newElements: CanvasElement[];

        switch (pendingLayout) {
          case 'column':
            const colHeight = (canvasHeight - (padding * (numElements + 1))) / numElements;
            newElements = elementsToArrange.map((el, index) => ({
              ...el,
              x: padding,
              y: padding + index * (colHeight + padding),
              width: canvasWidth - (padding * 2),
              height: colHeight,
            }));
            break;

          case 'row':
            const rowWidth = (canvasWidth - (padding * (numElements + 1))) / numElements;
            newElements = elementsToArrange.map((el, index) => ({
              ...el,
              x: padding + index * (rowWidth + padding),
              y: padding,
              width: rowWidth,
              height: canvasHeight - (padding * 2),
            }));
            break;

          case 'grid':
            const cols = Math.ceil(Math.sqrt(numElements));
            const rows = Math.ceil(numElements / cols);
            const gridCellWidth = (canvasWidth - (padding * (cols + 1))) / cols;
            const gridCellHeight = (canvasHeight - (padding * (rows + 1))) / rows;

            newElements = elementsToArrange.map((el, index) => {
              const colIndex = index % cols;
              const rowIndex = Math.floor(index / cols);
              return {
                ...el,
                x: padding + colIndex * (gridCellWidth + padding),
                y: padding + rowIndex * (gridCellHeight + padding),
                width: gridCellWidth,
                height: gridCellHeight,
              };
            });
            break;

          case 'main-sidebar':
            if (numElements === 0) {
              newElements = [...elementsToArrange];
              break;
            }
            const sidebarWidth = canvasWidth * 0.3;
            const mainWidth = canvasWidth - sidebarWidth - (padding * 3);

            newElements = elementsToArrange.map((el, index) => {
              if (index === 0) { // Main element
                return {
                  ...el,
                  x: padding,
                  y: padding,
                  width: mainWidth,
                  height: canvasHeight - (padding * 2),
                };
              } else { // Sidebar elements
                const sidebarElementsCount = numElements - 1;
                const sidebarElHeight = sidebarElementsCount > 0 ? (canvasHeight - (padding * (sidebarElementsCount + 1))) / sidebarElementsCount : 0;
                return {
                  ...el,
                  x: mainWidth + (padding * 2),
                  y: padding + (index - 1) * (sidebarElHeight + padding),
                  width: sidebarWidth,
                  height: sidebarElHeight,
                };
              }
            });
            break;
          default:
            newElements = [...elementsToArrange];
        }
        return newElements;
      });
      setIsApplyingLayout(false);
      setPendingLayout(null);
    }, 50);

  }, [pendingLayout, getDefaultProperties]);

  // Debug effect to monitor canvasElements changes
  useEffect(() => {
    console.log('Canvas elements changed:', canvasElements.length, 'elements');
    if (canvasElements.length > 0) {
      console.log('First element:', canvasElements[0]);
    }
  }, [canvasElements]);

  // Auto-dismiss loaded message after 3 seconds
  useEffect(() => {
    if (showLoadedMessage) {
      const timer = setTimeout(() => {
        setShowLoadedMessage(false);
      }, 3000); // 3 seconds

      return () => clearTimeout(timer);
    }
  }, [showLoadedMessage]);

  const [{ isOver, canDrop, itemType }, drop] = useDrop(
    () => ({
      accept: [ItemTypes.ELEMENT, ItemTypes.LAYOUT, ItemTypes.SHAPE],
      canDrop: () => !isReadOnly,
      drop: (item: { type: string; icon?: LucideIcon }, monitor) => {
        if (isReadOnly) return;
        const droppedItemType = monitor.getItemType();
        const offset = monitor.getClientOffset();

        if (droppedItemType === ItemTypes.LAYOUT) {
          setPendingLayout(item.type);
        } else if (droppedItemType === ItemTypes.ELEMENT || droppedItemType === ItemTypes.SHAPE) {
          if (offset && canvasRef.current) {
            const canvasBounds = canvasRef.current.getBoundingClientRect();
            const x = offset.x - canvasBounds.left;
            const y = offset.y - canvasBounds.top;

            const elementType = droppedItemType === ItemTypes.SHAPE ? 'Shapes' : item.type;
            const elementIcon = droppedItemType === ItemTypes.SHAPE ? Shapes : item.icon;

            if (!elementIcon) return;

            const newElement: CanvasElement = {
              id: Date.now(),
              type: elementType,
              icon: elementIcon,
              x: x - 100,
              y: y - 25,
              width: 200,
              height: 100,
              rotation: 0,
              properties: getDefaultProperties(elementType),
            };
            if (droppedItemType === ItemTypes.SHAPE) {
              newElement.properties.shape = item.type;
            }

            setCanvasElements((prev) => [...prev, newElement]);
            setSelectedElementId(newElement.id);
          }
        }
      },
      collect: (monitor) => ({
        isOver: !!monitor.isOver(),
        canDrop: !!monitor.canDrop(),
        itemType: monitor.getItemType()?.toString()
      }),
    }),
    [getDefaultProperties, isReadOnly]
  );

  drop(canvasRef);

  const handleDragStart = (e: React.MouseEvent, id: number, type: string) => {
    if (isReadOnly) return;
    e.stopPropagation();
    e.preventDefault();
    const element = canvasElements.find(el => el.id === id);
    if (!element) return;

    setSelectedElementId(id);
    setDragInfo({
      type,
      id,
      startX: e.clientX,
      startY: e.clientY,
      elementStartX: element.x,
      elementStartY: element.y,
      elementStartWidth: element.width,
      elementStartHeight: element.height,
    });
  };

  const handleMouseMove = useCallback((e: MouseEvent) => {
    if (!dragInfo || isReadOnly) return;

    const dx = e.clientX - dragInfo.startX;
    const dy = e.clientY - dragInfo.startY;
    const minSize = 20;

    if (dragInfo.type === 'move') {
      updateElement(dragInfo.id, {
        x: dragInfo.elementStartX + dx,
        y: dragInfo.elementStartY + dy,
      });
    } else if (dragInfo.type.startsWith('resize-')) {
      let { x, y, width, height } = {
        x: dragInfo.elementStartX,
        y: dragInfo.elementStartY,
        width: dragInfo.elementStartWidth,
        height: dragInfo.elementStartHeight,
      };
      const direction = dragInfo.type.replace('resize-', '');

      if (direction.includes('b')) { height = dragInfo.elementStartHeight + dy; }
      if (direction.includes('t')) { height = dragInfo.elementStartHeight - dy; y = dragInfo.elementStartY + dy; }
      if (direction.includes('r')) { width = dragInfo.elementStartWidth + dx; }
      if (direction.includes('l')) { width = dragInfo.elementStartWidth - dx; x = dragInfo.elementStartX + dx; }

      if (width < minSize) {
        if (direction.includes('l')) { x = dragInfo.elementStartX + dragInfo.elementStartWidth - minSize; }
        width = minSize;
      }
      if (height < minSize) {
        if (direction.includes('t')) { y = dragInfo.elementStartY + dragInfo.elementStartHeight - minSize; }
        height = minSize;
      }
      updateElement(dragInfo.id, { x, y, width, height });
    }
  }, [dragInfo, updateElement, isReadOnly]);

  const handleMouseUp = useCallback(() => {
    setDragInfo(null);
  }, []);

  useEffect(() => {
    if (dragInfo) {
      let cursor = 'grabbing';
      if (dragInfo.type.startsWith('resize-')) {
        const direction = dragInfo.type.replace('resize-', '');
        const cursorMap: { [key: string]: string } = {
          t: 'n-resize', b: 's-resize', l: 'w-resize', r: 'e-resize',
          tl: 'nw-resize', tr: 'ne-resize', bl: 'sw-resize', br: 'se-resize'
        };
        cursor = cursorMap[direction] || 'default';
      }
      document.body.style.cursor = cursor;
      document.body.style.userSelect = 'none';
      window.addEventListener('mousemove', handleMouseMove);
      window.addEventListener('mouseup', handleMouseUp);
    }

    return () => {
      document.body.style.cursor = 'default';
      document.body.style.userSelect = 'auto';
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    };
  }, [dragInfo, handleMouseMove, handleMouseUp]);


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
              <div className="flex flex-col items-center justify-center h-full text-center p-4">
                <ImageIcon className="w-8 h-8 mb-2 opacity-50" />
                <p className="text-sm font-medium">No image selected</p>
                <p className="text-xs opacity-75">Click the folder icon to choose an image</p>
              </div>
            </div>
          );
        }
        return <img src={properties.src} alt="" style={{ ...style, objectFit: properties.objectFit || 'cover' }} />;
      case 'Video':
        if (!properties.src || properties.src.trim() === '') {
          return (
            <div style={{ ...style, backgroundColor: 'hsl(var(--muted))', color: 'hsl(var(--muted-foreground))' }}>
              <div className="flex flex-col items-center justify-center h-full text-center p-4">
                <Video className="w-8 h-8 mb-2 opacity-50" />
                <p className="text-sm font-medium">No video selected</p>
                <p className="text-xs opacity-75">Click the folder icon to choose a video</p>
              </div>
            </div>
          );
        }
        return (
          <video
            src={properties.src}
            style={{ ...style, objectFit: properties.objectFit || 'cover' }}
            autoPlay={properties.autoplay}
            loop={properties.loop}
            muted={properties.muted}
            controls={properties.controls}
          />
        );
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

  const getCanvasBgColor = () => {
    if (isOver && canDrop) {
      if (itemType === ItemTypes.LAYOUT) {
        return 'hsl(var(--muted))';
      }
      return 'hsl(var(--accent)/0.1)';
    }
    return 'transparent';
  };

  const getDropMessage = () => {
    if (isOver && canDrop) {
      if (itemType === ItemTypes.LAYOUT) return <p className="text-primary bg-background px-2 rounded-sm absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-10">Drop to apply layout</p>;
      if (itemType === ItemTypes.ELEMENT || itemType === ItemTypes.SHAPE) return <p className="text-accent-foreground bg-background px-2 rounded-sm absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-10">Drop to add element</p>;
    }
    if (canvasElements.length === 0 && !isReadOnly) {
      return <p className="text-muted-foreground bg-background px-2 rounded-sm absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">Drop elements here</p>;
    }
    return null;
  }

  return (
    <div className="flex flex-col h-full bg-muted/40">
      <header className="flex items-center justify-between h-14 px-4 border-b bg-background">
        <h1 className="text-lg font-semibold flex items-center gap-2">
          {isLoadingTemplate && <Loader2 className="w-4 h-4 animate-spin" />}
          {templateName}
        </h1>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => {
              setCanvasElements([]);
              setSelectedElementId(null);
              setTemplateName("Untitled Template");
              setShowLoadedMessage(false);
              localStorage.removeItem('canvasPreviewElements');
            }}
            disabled={isReadOnly}
          >
            <RotateCcw className="mr-2" />
            Clear Canvas
          </Button>
          <Button variant="outline" size="sm" onClick={handlePreview}>
            <Eye className="mr-2" />
            Preview
          </Button>
          <SaveTemplateDialog onSave={handleSaveTemplate} disabled={isReadOnly}>
            <Button size="sm" disabled={isReadOnly}>
              <Save className="mr-2" />
              Save
            </Button>
          </SaveTemplateDialog>
        </div>
      </header>
      <main className="flex-1 flex overflow-hidden">
        <aside className="w-64 border-r bg-background overflow-y-auto">
          <div className="p-4 space-y-6">
            <div>
              <h2 className="text-md font-semibold mb-4">Elements</h2>
              <div className="grid grid-cols-2 gap-2">
                <DraggableElement label="Shapes" icon={Shapes} disabled={isReadOnly} />
                {elements.filter(el => el.label !== 'Shapes').map((el) => {
                  return <DraggableElement key={el.label} label={el.label} icon={el.icon} disabled={isReadOnly} />
                })}
              </div>
            </div>
            <div>
              <h2 className="text-md font-semibold mb-4">Layouts</h2>
              <p className="text-xs text-muted-foreground mb-2">Drag a layout onto the canvas to apply it.</p>
              <div className="grid grid-cols-2 gap-2">
                {layouts.map((layout) => (
                  <DraggableLayout key={layout.type} name={layout.name} type={layout.type} disabled={isReadOnly} />
                ))}
              </div>
            </div>

          </div>
        </aside>

        <div className="flex-1 flex flex-col items-center justify-center p-4 overflow-hidden">
          {showLoadedMessage && canvasElements.length > 0 && (
            <div className="mb-4 px-4 py-2 bg-green-100 border border-green-300 rounded-lg transition-opacity duration-300">
              <p className="text-green-800 text-sm font-medium">
                ✓ Loaded {canvasElements.length} element{canvasElements.length !== 1 ? 's' : ''} from template
              </p>
            </div>
          )}
          <div className="w-full h-full bg-background shadow-lg rounded-lg border flex items-center justify-center relative">
            <div className="absolute top-2 left-2 flex gap-1">
              <Button variant="ghost" size="icon"><ZoomIn /></Button>
              <Button variant="ghost" size="icon"><ZoomOut /></Button>
            </div>
            <div ref={canvasRef} className="w-[80%] h-[80%] border-2 border-dashed relative bg-[linear-gradient(to_right,theme(colors.border)_1px,transparent_1px),linear-gradient(to_bottom,theme(colors.border)_1px,transparent_1px)] bg-[size:2rem_2rem]" style={{ backgroundColor: getCanvasBgColor(), transition: 'background-color 0.2s', cursor: isReadOnly ? 'default' : 'auto' }}
              onClick={() => setSelectedElementId(null)}
            >
              {isApplyingLayout && (
                <div className="absolute inset-0 bg-background/80 flex flex-col items-center justify-center z-20">
                  <Loader2 className="w-8 h-8 animate-spin text-primary" />
                  <p className="mt-2 text-muted-foreground">Applying layout...</p>
                </div>
              )}
              {getDropMessage()}
              {canvasElements.map((el) => {
                const isSelected = selectedElementId === el.id;
                const showDottedBorder = !!pendingLayout;
                return (
                  <div key={el.id}
                    onMouseDown={(e) => !isReadOnly && handleDragStart(e, el.id, 'move')}
                    onClick={(e) => { e.stopPropagation(); setSelectedElementId(el.id) }}
                    style={{ position: 'absolute', top: `${el.y}px`, left: `${el.x}px`, width: `${el.width}px`, height: `${el.height}px` }}
                    className={!isReadOnly ? "cursor-grab" : "cursor-default"}
                  >
                    <div className={`w-full h-full ${showDottedBorder ? 'border-4 border-dotted border-black' : ''}`}>
                      {renderElementContent(el)}
                    </div>
                    {isSelected && !showDottedBorder && !isReadOnly && (
                      <>
                        <div className="absolute inset-0 border-2 border-primary pointer-events-none" />
                        {/* Corner handles */}
                        <div
                          className="absolute -left-[5px] -top-[5px] w-2.5 h-2.5 bg-primary rounded-full border-2 border-white cursor-nw-resize pointer-events-auto"
                          onMouseDown={(e) => handleDragStart(e, el.id, "resize-tl")}
                        />
                        <div
                          className="absolute -right-[5px] -top-[5px] w-2.5 h-2.5 bg-primary rounded-full border-2 border-white cursor-ne-resize pointer-events-auto"
                          onMouseDown={(e) => handleDragStart(e, el.id, "resize-tr")}
                        />
                        <div
                          className="absolute -left-[5px] -bottom-[5px] w-2.5 h-2.5 bg-primary rounded-full border-2 border-white cursor-sw-resize pointer-events-auto"
                          onMouseDown={(e) => handleDragStart(e, el.id, "resize-bl")}
                        />
                        <div
                          className="absolute -right-[5px] -bottom-[5px] w-2.5 h-2.5 bg-primary rounded-full border-2 border-white cursor-se-resize pointer-events-auto"
                          onMouseDown={(e) => handleDragStart(e, el.id, "resize-br")}
                        />
                        {/* Side handles */}
                        <div
                          className="absolute left-1/2 -translate-x-1/2 -top-[5px] w-2.5 h-2.5 bg-primary rounded-full border-2 border-white cursor-n-resize pointer-events-auto"
                          onMouseDown={(e) => handleDragStart(e, el.id, "resize-t")}
                        />
                        <div
                          className="absolute left-1/2 -translate-x-1/2 -bottom-[5px] w-2.5 h-2.5 bg-primary rounded-full border-2 border-white cursor-s-resize pointer-events-auto"
                          onMouseDown={(e) => handleDragStart(e, el.id, "resize-b")}
                        />
                        <div
                          className="absolute -left-[5px] top-1/2 -translate-y-1/2 w-2.5 h-2.5 bg-primary rounded-full border-2 border-white cursor-w-resize pointer-events-auto"
                          onMouseDown={(e) => handleDragStart(e, el.id, "resize-l")}
                        />
                        <div
                          className="absolute -right-[5px] top-1/2 -translate-y-1/2 w-2.5 h-2.5 bg-primary rounded-full border-2 border-white cursor-e-resize pointer-events-auto"
                          onMouseDown={(e) => handleDragStart(e, el.id, "resize-r")}
                        />
                      </>
                    )}
                  </div>
                )
              })}
            </div>
          </div>
        </div>

        <aside className="w-80 border-l bg-background overflow-y-auto">
          <PropertiesPanel
            element={selectedElement}
            onUpdate={updateElement}
            onDelete={deleteSelectedElement}
            isReadOnly={isReadOnly}
          />
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

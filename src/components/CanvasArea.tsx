import React from "react";
import { CanvasObject } from "./PaintingTool";
import { CircleSVG, SquareSVG, TriangleSVG } from "./ShapeSVG";

interface CanvasAreaProps {
  objects: CanvasObject[];
  onAddObject: (type: 'circle' | 'square' | 'triangle', x: number, y: number) => void;
  onRemoveObject: (id: string) => void;
}

export const CanvasArea: React.FC<CanvasAreaProps> = ({ 
  objects, 
  onAddObject,
  onRemoveObject 
}) => {
  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const shapeType = e.dataTransfer.getData('text/plain') as 'circle' | 'square' | 'triangle';
    
    if (shapeType) {
      onAddObject(shapeType, x - 40, y - 40);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleObjectDoubleClick = (id: string) => {
    onRemoveObject(id);
  };

  const renderShape = (obj: CanvasObject) => {
    const baseStyle = {
      position: "absolute" as const,
      left: obj.x,
      top: obj.y,
      width: 48,
      height: 48,
      cursor: "pointer",
      transition: "transform 0.2s",
      zIndex: 1,
    };
    switch (obj.type) {
      case 'circle':
        return (
          <div
            key={obj.id}
            style={baseStyle}
            onDoubleClick={() => handleObjectDoubleClick(obj.id)}
          >
            <CircleSVG />
          </div>
        );
      case 'square':
        return (
          <div
            key={obj.id}
            style={baseStyle}
            onDoubleClick={() => handleObjectDoubleClick(obj.id)}
          >
            <SquareSVG />
          </div>
        );
      case 'triangle':
        return (
          <div
            key={obj.id}
            style={baseStyle}
            onDoubleClick={() => handleObjectDoubleClick(obj.id)}
          >
            <TriangleSVG />
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="flex-1 relative">
      <div
        className="w-full h-full bg-canvas border-r relative overflow-hidden"
        onDrop={handleDrop}
        onDragOver={handleDragOver}
      >
        <div className="absolute inset-4 bg-canvas border-2 border-dashed border-border rounded-lg">
          <div className="flex items-center justify-center h-full text-muted-foreground text-lg font-medium">
            Canvas
          </div>
          {/* Render all objects */}
          {objects.map(renderShape)}
        </div>
      </div>
    </div>
  );
};
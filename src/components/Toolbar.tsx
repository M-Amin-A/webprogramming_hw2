import React from "react";
import { CircleSVG, SquareSVG, TriangleSVG } from "./ShapeSVG";
import { createRoot } from 'react-dom/client';

interface ToolbarProps {}

export const Toolbar: React.FC<ToolbarProps> = () => {

  const handleDragStart = (e: React.DragEvent, shapeType: string) => {
    const dragPreview = document.createElement('div');
  
    const shapeSVG = shapes.find(shape => shape.type === shapeType)?.svg;
    const root = createRoot(dragPreview);
    root.render(<div>{shapeSVG}</div>);

    dragPreview.style.position = 'absolute';
    dragPreview.style.left = '-9999px';

    document.body.appendChild(dragPreview);
  
    e.dataTransfer.setDragImage(dragPreview, 24, 24);
    e.dataTransfer.setData('text/plain', shapeType);
  
    setTimeout(() => document.body.removeChild(dragPreview));
  };

  const shapes = [
    { type: 'circle', name: 'Circle', svg: <CircleSVG /> },
    { type: 'square', name: 'Square', svg: <SquareSVG /> },
    { type: 'triangle', name: 'Triangle', svg: <TriangleSVG /> },
  ];

  return (
    <div className="w-24 bg-toolbar border-l shadow-soft flex flex-col">
      <div className="p-4">
        <h3 className="text-sm font-semibold text-foreground mb-4 text-center">Tools</h3>
        <div className="space-y-4">
          {shapes.map((shape) => (
            <div key={shape.type} className="flex flex-col items-center">
              <div
                draggable
                onDragStart={(e) => handleDragStart(e, shape.type)}
                className="w-12 h-12 cursor-grab active:cursor-grabbing transition-transform hover:scale-110 shadow-soft flex items-center justify-center"
                style={{ background: "none" }}
              >
                {shape.svg}
              </div>
              <span className="text-xs text-muted-foreground mt-1 text-center">
                {shape.name}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
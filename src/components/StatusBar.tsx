import React from "react";
import { CircleSVG, SquareSVG, TriangleSVG } from "./ShapeSVG";

interface StatusBarProps {
  counts: {
    circle: number;
    square: number;
    triangle: number;
  };
}

export const StatusBar: React.FC<StatusBarProps> = ({ counts }) => {
  const items = [
    { type: 'circle', name: 'Circle', count: counts.circle },
    { type: 'square', name: 'Square', count: counts.square },
    { type: 'triangle', name: 'Triangle', count: counts.triangle },
  ];

  const getSVG = (type: string) => {
    switch (type) {
      case 'circle':
        return <CircleSVG size={24} />;
      case 'square':
        return <SquareSVG size={24} />;
      case 'triangle':
        return <TriangleSVG size={24} />;
      default:
        return null;
    }
  };

  return (
    <div className="h-16 bg-status-bg border-t shadow-soft flex items-center px-6 gap-6">
      {items.map((item) => (
        <div key={item.type} className="flex items-center gap-2">
          {getSVG(item.type)}
          <span className="text-sm text-foreground font-medium">
            {item.count}
          </span>
        </div>
      ))}
    </div>
  );
};
import React from "react";

interface ShapeSVGProps {
  size?: number;
  color?: string;
}

export const CircleSVG: React.FC<ShapeSVGProps> = ({ size = 48, color = "#0DA2E7" }) => (
  <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
    <circle cx={size / 2} cy={size / 2} r={size / 2 - 2} fill={color} />
  </svg>
);

export const SquareSVG: React.FC<ShapeSVGProps> = ({ size = 48, color = "#00B843" }) => (
  <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
    <rect x={2} y={2} width={size - 4} height={size - 4} fill={color} />
  </svg>
);

export const TriangleSVG: React.FC<ShapeSVGProps> = ({ size = 48, color = "#F97415" }) => (
  <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
    <polygon points={`${size / 2},2 2,${size - 2} ${size - 2},${size - 2}`} fill={color} />
  </svg>
); 
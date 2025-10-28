import React from 'react';
import { FlowNode } from '../../types';

interface FlowEdgeProps {
  sourceNode: FlowNode;
  targetNode: FlowNode;
  onDelete: () => void;
}

const getEdgePath = (sourcePos: {x: number, y: number}, targetPos: {x: number, y: number}) => {
    const sourceHandleX = sourcePos.x + 192; // Right edge of source node
    const sourceHandleY = sourcePos.y + 48;  // Vertical center of node
    const targetHandleX = targetPos.x;     // Left edge of target node
    const targetHandleY = targetPos.y + 48;

    const bezierOffset = Math.max(20, Math.abs(targetHandleX - sourceHandleX) * 0.4);

    const path = `M ${sourceHandleX},${sourceHandleY} C ${sourceHandleX + bezierOffset},${sourceHandleY} ${targetHandleX - bezierOffset},${targetHandleY} ${targetHandleX},${targetHandleY}`;
    
    return path;
};

const FlowEdge: React.FC<FlowEdgeProps> = ({ sourceNode, targetNode, onDelete }) => {
  const path = getEdgePath(sourceNode.position, targetNode.position);

  return (
    // FIX: Replaced the 'title' prop on the <g> element with a nested <title> element, which is the standard SVG method for tooltips and resolves the TypeScript error.
    <g className="group pointer-events-auto cursor-pointer" onClick={onDelete}>
      <title>Click to delete connection</title>
      <path
        d={path}
        stroke="transparent"
        strokeWidth="15"
        fill="none"
      />
      <path
        d={path}
        stroke="gray"
        strokeWidth="2"
        fill="none"
        className="group-hover:stroke-red-500 transition-colors duration-200"
        markerEnd="url(#arrow)"
      />
    </g>
  );
};

export default FlowEdge;
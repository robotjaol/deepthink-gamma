import React, { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { X } from 'lucide-react';
import { FlowNode as FlowNodeType } from '../../types';

interface FlowNodeProps {
  node: FlowNodeType;
  onDrag: (id: string, position: { x: number; y: number }) => void;
  onDelete: (id: string) => void;
  onStartConnectorDrag: (e: React.PointerEvent, nodeId: string) => void;
  onConnect: (e: React.PointerEvent, nodeId: string) => void;
  onContentChange: (id: string, content: string) => void;
}

const FlowNode: React.FC<FlowNodeProps> = ({ node, onDrag, onDelete, onStartConnectorDrag, onConnect, onContentChange }) => {
  const [isEditing, setIsEditing] = useState(false);
  const textAreaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    if (isEditing && textAreaRef.current) {
      textAreaRef.current.focus();
      textAreaRef.current.select();
    }
  }, [isEditing]);

  const handleFinishEditing = () => {
    setIsEditing(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleFinishEditing();
    } else if (e.key === 'Escape') {
      handleFinishEditing();
    }
  };

  return (
    <motion.div
      drag
      dragMomentum={false}
      onDragEnd={(event, info) => {
        if (!isEditing) {
            onDrag(node.id, { x: node.position.x + info.offset.x, y: node.position.y + info.offset.y });
        }
      }}
      style={{
        x: node.position.x,
        y: node.position.y,
        position: 'absolute',
        touchAction: 'none',
      }}
      className={`bg-light-primary dark:bg-dark-secondary rounded-lg shadow-lg w-48 cursor-grab active:cursor-grabbing border border-gray-300 dark:border-gray-700 transition-all duration-200 ${isEditing ? 'ring-2 ring-light-accent dark:ring-dark-accent cursor-default shadow-xl scale-105' : 'hover:shadow-md'}`}
      onDoubleClick={() => !isEditing && setIsEditing(true)}
      onPointerUp={(e) => {
        if (!isEditing) onConnect(e, node.id);
      }}
    >
      <div className="p-3 h-24">
        {isEditing ? (
          <textarea
            ref={textAreaRef}
            value={node.content}
            onChange={(e) => onContentChange(node.id, e.target.value)}
            onBlur={handleFinishEditing}
            onKeyDown={handleKeyDown}
            className="w-full h-full bg-transparent border-0 focus:outline-none resize-none text-sm text-light-text dark:text-dark-text"
            rows={3}
            onClick={(e) => e.stopPropagation()}
            onPointerDown={(e) => e.stopPropagation()} 
          />
        ) : (
          <div className="w-full h-full overflow-y-auto text-sm text-light-text dark:text-dark-text whitespace-pre-wrap break-words select-none pointer-events-none">
             {node.content || <span className="text-gray-400">Double-click to edit...</span>}
          </div>
        )}
      </div>
      <button
        onClick={(e) => { e.stopPropagation(); onDelete(node.id); }}
        className="absolute -top-2 -right-2 p-1 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors z-10 opacity-50 hover:opacity-100"
        aria-label="Delete node"
      >
        <X size={12} />
      </button>
      
      {/* Output Connector Handle */}
      <div
        onPointerDown={(e) => {
            e.stopPropagation();
            onStartConnectorDrag(e, node.id);
        }}
        className="absolute top-1/2 -right-2 -translate-y-1/2 w-4 h-4 bg-light-accent dark:bg-dark-accent rounded-full border-2 border-light-primary dark:border-dark-secondary cursor-crosshair z-10"
        title="Drag to connect"
      />
    </motion.div>
  );
};

export default FlowNode;

import React, { useState, useMemo, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence, PanInfo } from 'framer-motion';
import { DUMMY_SCENARIOS } from '../../../constants';
import { ScenarioTemplate } from '../../../types';

interface MapNode {
    id: string;
    isHub: boolean;
    name: string;
    jobType?: string;
    position: {
        x: number;
        y: number;
    }
}

interface MapLine {
    id: string;
    sourceId: string;
    targetId: string;
}

const ScenarioMap = () => {
    const navigate = useNavigate();
    const [hoveredNode, setHoveredNode] = useState<MapNode | null>(null);
    const planeRef = useRef<HTMLDivElement>(null);
    const [dragConstraints, setDragConstraints] = useState({ left: 0, right: 0, top: 0, bottom: 0 });
    const [planeDimensions, setPlaneDimensions] = useState({ width: 0, height: 0 });

    const [nodes, setNodes] = useState<MapNode[]>([]);
    const [lines, setLines] = useState<MapLine[]>([]);

    useEffect(() => {
        const measureAndInitialize = () => {
            if (planeRef.current) {
                const planeWidth = planeRef.current.offsetWidth;
                const planeHeight = planeRef.current.offsetHeight;
                setPlaneDimensions({ width: planeWidth, height: planeHeight });

                // Initialize layout
                const hubPositions: { [key: string]: { x: number; y: number } } = {
                    'PR Manager': { x: 20, y: 25 }, 'Product Manager': { x: 50, y: 50 },
                    'Operations Manager': { x: 80, y: 25 }, 'CEO': { x: 50, y: 75 },
                };
                const scenariosByPath = DUMMY_SCENARIOS.reduce((acc, s) => {
                    if (!acc[s.jobType]) acc[s.jobType] = [];
                    acc[s.jobType].push(s);
                    return acc;
                }, {} as Record<string, ScenarioTemplate[]>);

                const newNodes: MapNode[] = [];
                const newLines: MapLine[] = [];

                Object.entries(scenariosByPath).forEach(([path, scenarios]) => {
                    const hubPos = hubPositions[path] || { x: 50, y: 50 };
                    newNodes.push({
                        id: path, isHub: true, name: path,
                        position: { x: (hubPos.x / 100) * planeWidth, y: (hubPos.y / 100) * planeHeight },
                    });
                    
                    scenarios.forEach((scenario, index) => {
                        const angle = (index / scenarios.length) * 2 * Math.PI + (path.length / 13);
                        const nodeX = (hubPos.x + 15 * Math.cos(angle)) / 100 * planeWidth;
                        const nodeY = (hubPos.y + 25 * Math.sin(angle)) / 100 * planeHeight;
                        
                        newNodes.push({
                            id: scenario.id, isHub: false, name: scenario.name, jobType: scenario.jobType,
                            position: { x: nodeX, y: nodeY },
                        });

                        newLines.push({ id: `line-${scenario.id}`, sourceId: path, targetId: scenario.id });
                    });
                });
                setNodes(newNodes);
                setLines(newLines);

                // Set drag constraints for the plane
                const containerWidth = planeRef.current.parentElement?.offsetWidth || planeWidth;
                const containerHeight = planeRef.current.parentElement?.offsetHeight || planeHeight;
                setDragConstraints({
                    left: -(planeWidth - containerWidth), right: 0,
                    top: -(planeHeight - containerHeight), bottom: 0,
                });
            }
        };

        measureAndInitialize();
        window.addEventListener('resize', measureAndInitialize);
        return () => window.removeEventListener('resize', measureAndInitialize);
    }, []);

    const handleNodeDrag = (nodeId: string, newPosition: {x: number; y: number}) => {
        setNodes(currentNodes => currentNodes.map(n => n.id === nodeId ? { ...n, position: newPosition } : n));
    };
    
    const getNodeById = (id: string) => nodes.find(n => n.id === id);

    return (
        <motion.div 
            className="relative w-full h-[70vh] bg-light-secondary/50 dark:bg-dark-secondary/50 rounded-xl border border-gray-200 dark:border-gray-700 overflow-hidden cursor-grab active:cursor-grabbing"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
        >
            <motion.div
                ref={planeRef}
                className="relative w-[150%] h-[150%]"
                drag
                dragConstraints={dragConstraints}
            >
                <svg width="100%" height="100%" className="absolute inset-0 pointer-events-none">
                    {lines.map(line => {
                        const source = getNodeById(line.sourceId);
                        const target = getNodeById(line.targetId);
                        if (!source || !target) return null;
                        
                        const sourceX = source.position.x + 75; // Approx center of hub
                        const sourceY = source.position.y;
                        const targetX = target.position.x;
                        const targetY = target.position.y;

                        const path = `M ${sourceX},${sourceY} C ${sourceX},${(sourceY + targetY)/2}, ${targetX},${(sourceY + targetY)/2}, ${targetX},${targetY}`;
                        
                        return (
                             <motion.path
                                key={line.id}
                                d={path}
                                stroke="currentColor" 
                                className="text-gray-300 dark:text-gray-600"
                                strokeWidth="1.5"
                                fill="none"
                                transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                            />
                        );
                    })}
                </svg>
                <div className="relative w-full h-full">
                    {nodes.map(node => (
                        <motion.div
                            key={node.id}
                            drag={!node.isHub}
                            dragMomentum={false}
                            onDrag={(e, info) => handleNodeDrag(node.id, { x: node.position.x + info.delta.x, y: node.position.y + info.delta.y })}
                            className="absolute"
                            style={{
                                x: node.position.x - (node.isHub ? 75 : 90),
                                y: node.position.y - (node.isHub ? 25 : 40),
                            }}
                            onMouseEnter={() => setHoveredNode(node)}
                            onMouseLeave={() => setHoveredNode(null)}
                            transition={{ type: "spring", stiffness: 400, damping: 25 }}
                        >
                            {node.isHub ? (
                                <motion.div className="flex items-center justify-center p-3 rounded-lg bg-light-accent/80 dark:bg-dark-accent/30 text-center shadow-lg backdrop-blur-sm w-[150px] h-[50px] cursor-default">
                                    <h3 className="font-bold text-lg">{node.name}</h3>
                                </motion.div>
                            ) : (
                                <motion.div
                                    className="p-3 rounded-lg bg-light-primary dark:bg-dark-primary shadow-md cursor-pointer text-center border border-gray-200 dark:border-gray-700 w-[180px] h-[80px] flex items-center justify-center"
                                    whileHover={{ scale: 1.1, zIndex: 10, boxShadow: '0px 10px 20px rgba(0,0,0,0.2)' }}
                                    transition={{ type: "spring", stiffness: 400, damping: 10 }}
                                    onClick={() => navigate(`/dashboard/scenario/${node.id}`)}
                                >
                                    <p className="text-sm font-semibold">{node.name}</p>
                                </motion.div>
                            )}
                        </motion.div>
                    ))}
                    <AnimatePresence>
                        {hoveredNode && (
                            <motion.div
                                className="absolute p-3 rounded-lg bg-light-primary dark:bg-dark-primary shadow-lg border border-gray-200 dark:border-gray-700 pointer-events-none"
                                style={{
                                    x: hoveredNode.position.x - 90,
                                    y: hoveredNode.position.y - 120, // Position above the node
                                    zIndex: 20,
                                }}
                                initial={{ opacity: 0, y: 10, scale: 0.95 }}
                                animate={{ opacity: 1, y: 0, scale: 1 }}
                                exit={{ opacity: 0, y: 10, scale: 0.95 }}
                                transition={{ duration: 0.2, ease: 'easeOut' }}
                            >
                                <h4 className="font-bold text-base whitespace-nowrap">{hoveredNode.name}</h4>
                                {hoveredNode.jobType && (
                                    <p className="text-sm text-gray-500 dark:text-gray-400">For: {hoveredNode.jobType}</p>
                                )}
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
            </motion.div>
        </motion.div>
    );
};

export default ScenarioMap;

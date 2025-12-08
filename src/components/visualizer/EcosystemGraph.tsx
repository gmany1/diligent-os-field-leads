'use client';

import React, { useMemo } from 'react';
import ReactFlow, {
    Background,
    Controls,
    MiniMap,
    Node,
    Edge,
    Handle,
    Position,
    MarkerType
} from 'reactflow';
import 'reactflow/dist/style.css';
import { User, Shield, Users, MapPin, Briefcase } from 'lucide-react';

interface EcosystemGraphProps {
    branch: any;
}

// Custom Node for displaying detailed info card
const CustomNode = ({ data }: { data: any }) => {
    return (
        <div className={`p-3 rounded-lg shadow-md border-2 min-w-[200px] bg-white dark:bg-gray-800 ${data.borderColor}`}>
            <div className="flex items-center space-x-3 mb-2">
                <div className={`p-2 rounded-full ${data.iconBg}`}>
                    {data.icon}
                </div>
                <div>
                    <h4 className="font-bold text-sm text-gray-900 dark:text-gray-100">{data.label}</h4>
                    <p className="text-xs text-gray-500">{data.subLabel}</p>
                </div>
            </div>
            {data.stats && (
                <div className="mt-2 pt-2 border-t border-gray-100 dark:border-gray-700 grid grid-cols-2 gap-2 text-xs">
                    {Object.entries(data.stats).map(([key, value]) => (
                        <div key={key}>
                            <span className="text-gray-400 capitalize">{key}:</span> <span className="font-semibold">{String(value)}</span>
                        </div>
                    ))}
                </div>
            )}
            <Handle type="target" position={Position.Top} className="w-2 h-2" />
            <Handle type="source" position={Position.Bottom} className="w-2 h-2" />
        </div>
    );
};

const nodeTypes = {
    custom: CustomNode,
};

export default function EcosystemGraph({ branch }: EcosystemGraphProps) {
    const { nodes, edges } = useMemo(() => {
        const nodes: Node[] = [];
        const edges: Edge[] = [];

        if (!branch) return { nodes, edges };

        // 1. Central Branch Node
        const centerX = 400; // Center of canvas
        nodes.push({
            id: 'branch-root',
            type: 'custom',
            position: { x: centerX, y: 0 },
            data: {
                label: branch.name,
                subLabel: branch.code,
                icon: <MapPin size={16} className="text-white" />,
                iconBg: 'bg-indigo-600',
                borderColor: 'border-indigo-600',
                stats: { Leads: branch._count?.leads || 0, Staff: branch.users?.length || 0 }
            },
        });

        // 2. Manager Node
        const manager = branch.users?.find((u: any) => u.role === 'BRANCH_MANAGER' || u.role === 'MANAGER');
        if (manager) {
            nodes.push({
                id: `manager-${manager.id}`,
                type: 'custom',
                position: { x: centerX, y: 200 },
                data: {
                    label: manager.name || 'Manager',
                    subLabel: 'Branch Manager',
                    icon: <Shield size={16} className="text-white" />,
                    iconBg: 'bg-purple-600',
                    borderColor: 'border-purple-600',
                    stats: { Leads: manager._count?.leads || 0 }
                },
            });

            // Edge from Branch to Manager
            edges.push({
                id: 'e-branch-manager',
                source: 'branch-root',
                target: `manager-${manager.id}`,
                type: 'smoothstep',
                animated: true,
                style: { stroke: '#9333ea', strokeWidth: 2 },
            });
        }

        // 3. Staff Nodes (Reps)
        const staff = branch.users?.filter((u: any) => u.role !== 'BRANCH_MANAGER' && u.role !== 'MANAGER') || [];
        const startX = centerX - ((staff.length - 1) * 220) / 2; // Center the row

        staff.forEach((user: any, index: number) => {
            const isActive = (user._count?.leads || 0) > 0;
            nodes.push({
                id: `user-${user.id}`,
                type: 'custom',
                position: { x: startX + index * 220, y: 450 },
                data: {
                    label: user.name || 'Staff',
                    subLabel: user.role.replace(/_/g, ' '),
                    icon: <User size={16} className="text-white" />,
                    iconBg: isActive ? 'bg-green-500' : 'bg-gray-400',
                    borderColor: isActive ? 'border-green-500' : 'border-gray-300',
                    stats: { Leads: user._count?.leads || 0 }
                },
            });

            // Edge from Manager (or Branch if no manager) to User
            edges.push({
                id: `e-manager-user-${user.id}`,
                source: manager ? `manager-${manager.id}` : 'branch-root',
                target: `user-${user.id}`,
                type: 'smoothstep',
                markerEnd: { type: MarkerType.ArrowClosed },
                style: { stroke: '#cbd5e1' },
            });
        });

        return { nodes, edges };
    }, [branch]);

    return (
        <div className="w-full h-full min-h-[500px] bg-gray-50 dark:bg-gray-900 rounded-lg overflow-hidden border border-gray-200 dark:border-gray-700">
            {/* Mobile Fallback: List View */}
            <div className="md:hidden p-4 space-y-4">
                <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow border-l-4 border-indigo-500">
                    <h3 className="font-bold flex items-center text-lg"><MapPin size={18} className="mr-2 text-indigo-500" /> {branch?.name}</h3>
                    <p className="text-gray-500 text-sm ml-6">{branch?.code}</p>
                </div>

                <div className="pl-4 border-l-2 border-gray-200 dark:border-gray-700 space-y-4">
                    {/* Manager Section */}
                    {branch?.users?.filter((u: any) => u.role.includes('MANAGER')).map((mgr: any) => (
                        <div key={mgr.id} className="relative">
                            <div className="absolute -left-[25px] top-3 w-4 h-4 rounded-full bg-purple-500 border-4 border-gray-50 dark:border-gray-900"></div>
                            <div className="bg-white dark:bg-gray-800 p-3 rounded shadow-sm border border-purple-100 dark:border-purple-900/30">
                                <h4 className="font-bold text-sm flex items-center"><Shield size={14} className="mr-2 text-purple-500" /> {mgr.name}</h4>
                                <p className="text-xs text-gray-500 ml-5">Branch Manager</p>
                            </div>

                            {/* Reps nested under Manager */}
                            <div className="mt-3 ml-4 space-y-2 border-l-2 border-dashed border-gray-200 dark:border-gray-700 pl-4">
                                {branch?.users?.filter((u: any) => !u.role.includes('MANAGER')).map((rep: any) => (
                                    <div key={rep.id} className="bg-white dark:bg-gray-800 p-2 rounded border border-gray-100 dark:border-gray-700 flex justify-between items-center">
                                        <div className="flex items-center">
                                            <div className={`w-2 h-2 rounded-full mr-2 ${rep._count?.leads > 0 ? 'bg-green-500' : 'bg-gray-300'}`}></div>
                                            <span className="text-sm font-medium">{rep.name}</span>
                                        </div>
                                        <span className="text-xs text-gray-400">{rep._count?.leads || 0} leads</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Desktop: React Flow Graph */}
            <div className="hidden md:block w-full h-[600px]">
                <ReactFlow
                    nodes={nodes}
                    edges={edges}
                    nodeTypes={nodeTypes}
                    fitView
                    attributionPosition="bottom-right"
                    minZoom={0.5}
                    maxZoom={1.5}
                >
                    <Background color="#94a3b8" gap={16} />
                    <Controls />
                    <MiniMap nodeStrokeColor={(n) => {
                        if (n.type === 'custom') return '#6366f1';
                        return '#eee';
                    }} />
                </ReactFlow>
            </div>
        </div>
    );
}

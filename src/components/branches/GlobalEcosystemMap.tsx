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
    MarkerType,
    useNodesState,
    useEdgesState,
    NodeMouseHandler
} from 'reactflow';
import 'reactflow/dist/style.css';
import { Building2, MapPin, Globe } from 'lucide-react';
import { useRouter } from 'next/navigation';

interface GlobalMapProps {
    branches: any[];
}

// Custom Node for displaying detailed info card
const BranchNode = ({ data }: { data: any }) => {
    return (
        <div className={`p-4 rounded-xl shadow-lg border-2 min-w-[220px] bg-white dark:bg-gray-800 transition-all hover:scale-105 cursor-pointer ${data.borderColor}`}>
            <div className="flex items-center space-x-3 mb-3">
                <div className={`p-2.5 rounded-full shadow-inner ${data.iconBg}`}>
                    {data.icon}
                </div>
                <div>
                    <h4 className="font-bold text-sm text-gray-900 dark:text-gray-100">{data.label}</h4>
                    <p className="text-xs text-gray-500">{data.subLabel}</p>
                </div>
            </div>

            {/* KPI Grid */}
            <div className="pt-2 border-t border-gray-100 dark:border-gray-700 grid grid-cols-2 gap-y-2 gap-x-4 text-xs">
                <div>
                    <span className="text-gray-400 block mb-0.5">Revenue</span>
                    <span className="font-bold text-gray-800 dark:text-gray-200">
                        {data.stats.revenue?.toLocaleString('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 })}
                    </span>
                </div>
                <div className="text-right">
                    <span className="text-gray-400 block mb-0.5">Health</span>
                    <span className={`font-bold px-1.5 py-0.5 rounded text-[10px] ${data.stats.healthScore >= 90 ? 'bg-green-100 text-green-700' :
                            data.stats.healthScore >= 70 ? 'bg-yellow-100 text-yellow-700' :
                                'bg-red-100 text-red-700'
                        }`}>
                        {data.stats.healthScore}/100
                    </span>
                </div>
                <div>
                    <span className="text-gray-400 block mb-0.5">Leads</span>
                    <span className="font-semibold text-gray-700 dark:text-gray-300">{data.stats.leadsWon} Won</span>
                </div>
                <div className="text-right">
                    <span className="text-gray-400 block mb-0.5">Team</span>
                    <span className="font-semibold text-gray-700 dark:text-gray-300">{data.stats.users} Users</span>
                </div>
            </div>

            <Handle type="target" position={Position.Top} className="w-2 h-2 !bg-gray-400" />
            <Handle type="source" position={Position.Bottom} className="w-2 h-2 !bg-gray-400" />
        </div>
    );
};

// Root HQ Node
const HQNode = ({ data }: { data: any }) => {
    return (
        <div className="p-6 rounded-full shadow-xl border-4 border-indigo-600 bg-indigo-600 text-white w-[120px] h-[120px] flex flex-col items-center justify-center text-center animate-pulse-slow">
            <Globe size={32} className="mb-2" />
            <div className="font-bold text-xs">DiligentOS HQ</div>
            <Handle type="source" position={Position.Bottom} className="!bg-white" />
        </div>
    );
};

const nodeTypes = {
    branch: BranchNode,
    hq: HQNode
};

export default function GlobalEcosystemMap({ branches }: GlobalMapProps) {
    const router = useRouter();

    const { initialNodes, initialEdges } = useMemo(() => {
        const nodes: Node[] = [];
        const edges: Edge[] = [];

        if (!branches || branches.length === 0) return { initialNodes: nodes, initialEdges: edges };

        // 1. HQ Node
        const centerX = 600;
        nodes.push({
            id: 'hq',
            type: 'hq',
            position: { x: centerX, y: 0 },
            data: { label: 'HQ' }
        });

        // 2. Branch Nodes layout (Simple Grid or Tree)
        // Let's do a simple row or multi-row layout
        const ROW_WIDTH = 4;
        const X_SPACING = 300;
        const Y_SPACING = 250;

        branches.forEach((branch, index) => {
            const row = Math.floor(index / ROW_WIDTH);
            const col = index % ROW_WIDTH;

            // Center the row
            const itemsInThisRow = Math.min(ROW_WIDTH, branches.length - (row * ROW_WIDTH));
            const rowStartX = centerX - ((itemsInThisRow - 1) * X_SPACING) / 2;

            const x = rowStartX + (col * X_SPACING);
            const y = 200 + (row * Y_SPACING);

            const isHighPerf = (branch.stats?.healthScore || 0) >= 80;

            nodes.push({
                id: branch.id,
                type: 'branch',
                position: { x, y },
                data: {
                    label: branch.name,
                    subLabel: `${branch.city}, ${branch.state}`,
                    icon: <Building2 size={16} className="text-white" />,
                    iconBg: isHighPerf ? 'bg-green-600' : 'bg-indigo-500',
                    borderColor: isHighPerf ? 'border-green-500' : 'border-indigo-200',
                    stats: {
                        revenue: branch.stats?.revenue || 0,
                        healthScore: branch.stats?.healthScore || 0,
                        leadsWon: branch.stats?.leadsWon || 0,
                        users: branch._count?.users || 0
                    }
                }
            });

            edges.push({
                id: `e-hq-${branch.id}`,
                source: 'hq',
                target: branch.id,
                type: 'smoothstep',
                animated: true,
                style: { stroke: isHighPerf ? '#22c55e' : '#cbd5e1', strokeWidth: 2 },
            });
        });

        return { initialNodes: nodes, initialEdges: edges };
    }, [branches]);

    const onNodeClick: NodeMouseHandler = (event, node) => {
        if (node.type === 'branch') {
            router.push(`/branches/${node.id}`);
        }
    };

    return (
        <div className="w-full h-[700px] bg-slate-50 dark:bg-slate-900 rounded-xl overflow-hidden border border-slate-200 dark:border-slate-800 shadow-inner">
            <ReactFlow
                defaultNodes={initialNodes}
                defaultEdges={initialEdges}
                nodeTypes={nodeTypes}
                fitView
                onNodeClick={onNodeClick}
                minZoom={0.2}
                maxZoom={2}
                attributionPosition="bottom-right"
            >
                <Background color="#94a3b8" gap={20} size={1} />
                <Controls />
                <MiniMap nodeStrokeColor={(n) => {
                    if (n.type === 'hq') return '#4f46e5';
                    if (n.type === 'branch') return '#10b981';
                    return '#eee';
                }} />
            </ReactFlow>
        </div>
    );
}

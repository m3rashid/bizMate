import { useCallback } from 'react'
import ReactFlow, { addEdge, MiniMap, Controls, Background, useNodesState, useEdgesState } from 'reactflow'
import 'reactflow/dist/style.css'

const initialNodes = [
	{ id: '1', position: { x: 0, y: 0 }, data: { label: '1' } },
	{ id: '2', position: { x: 0, y: 100 }, data: { label: '2' } },
]
const initialEdges = [{ id: 'e1-2', source: '1', target: '2' }]
function FlowDesigner() {
	const [nodes, onNodesChange] = useNodesState(initialNodes)
	const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges)

	const onConnect = useCallback((params: any) => setEdges((eds) => addEdge(params, eds)), [setEdges])

	return (
		<div className="h-[calc(100vh-74px)] w-[calc(100vw-32px)]">
			<ReactFlow nodes={nodes} edges={edges} onNodesChange={onNodesChange} onEdgesChange={onEdgesChange} onConnect={onConnect}>
				<Controls />
				<MiniMap />
				<Background gap={12} size={1} />
			</ReactFlow>
		</div>
	)
}

export default FlowDesigner

package functions

import (
	"bizmate/models"
	"fmt"
)

type ExecutionGraph struct {
	Nodes map[uint]*flowStepParamType
	Edges map[uint][]uint
}

func NewExecutionGraph() *ExecutionGraph {
	return &ExecutionGraph{
		Nodes: make(map[uint]*flowStepParamType),
		Edges: make(map[uint][]uint),
	}
}

func BuildGraph(nodes []models.WorkflowStep, edges []models.WorkflowEdge) *ExecutionGraph {
	graph := NewExecutionGraph()

	for _, edge := range edges {
		if edge.From == edge.To {
			continue // ignore self loops
		}

		graph.Edges[edge.From] = append(graph.Edges[edge.From], edge.To)
	}

	for _, node := range nodes {
		graph.Nodes[node.ID] = &flowStepParamType{
			FunctionName: node.FunctionName,
			Input:        node.Input,
		}
	}

	return graph
}

func (execGraph *ExecutionGraph) Display() {
	for id, node := range execGraph.Nodes {
		fmt.Printf("Node %d: %s\n", id, node.FunctionName)
		if edges, exists := execGraph.Edges[id]; exists {
			for _, to := range edges {
				fmt.Printf("  -> %d\n", to)
			}
		}
	}
}

func (execGraph *ExecutionGraph) HasCycle() bool {
	visited := make(map[uint]bool)
	recStack := make(map[uint]bool)

	var dfs func(uint) bool
	dfs = func(node uint) bool {
		if recStack[node] {
			return true
		}

		if visited[node] {
			return false
		}

		visited[node] = true
		recStack[node] = true

		for _, neighbor := range execGraph.Edges[node] {
			if dfs(neighbor) {
				return true
			}
		}

		recStack[node] = false
		return false
	}

	for node := range execGraph.Nodes {
		if dfs(node) {
			return true
		}
	}

	return false
}

func (execGraph *ExecutionGraph) TopologicalSort(startNode, endNode uint) {}

func (execgraph *ExecutionGraph) Execute() {}

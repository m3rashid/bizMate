package functions

import "bizmate/models"

type flowStepType interface {
	preProcess(flowStepParamType) error
	execute() error
	postProcess(flowStepParamType) (flowStepParamType, error)
}

const (
	functionAdd models.FunctionNameType = "add"
)

var functionsMap = map[models.FunctionNameType]flowStepType{
	functionAdd: &Add{},
}

type flowStepParamType struct {
	// NodeID       uint                    `json:"nodeId"`
	FunctionName models.FunctionNameType `json:"functionName"`
	Input        string                  `json:"input"`
	Output       string                  `json:"output"`
}

func (flowParams *flowStepParamType) getFlowStep() flowStepType {
	foundFlowStep, ok := functionsMap[flowParams.FunctionName]
	if !ok {
		return nil
	}
	return foundFlowStep
}

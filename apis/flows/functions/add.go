package functions

import (
	"encoding/json"
	"errors"
	"fmt"
)

type Add struct {
	Input  []float64 `json:"input"`
	Output float64   `json:"output"`
}

func (add *Add) preProcess(flowStep flowStepParamType) error {
	params := Add{}
	if err := json.Unmarshal([]byte(flowStep.Input), &params.Input); err != nil {
		return errors.New("input is not a valid json")
	}

	// not necessarily required to validate this
	// if err := json.Unmarshal([]byte(flowStep.Output), &params.Output); err != nil {
	// 	return errors.New("output is not a valid json")
	// }

	fmt.Printf("%+v\n", params)
	return nil
}

func (add *Add) execute() error {
	res := float64(0)
	for _, num := range add.Input {
		res += num
	}
	add.Output = res
	return nil
}

func (add *Add) postProcess(flowStepParam flowStepParamType) (flowStepParamType, error) {
	return flowStepParamType{
		FunctionName: flowStepParam.FunctionName,
		Input:        flowStepParam.Input,
		Output:       fmt.Sprintf("%f", add.Output),
	}, nil
}

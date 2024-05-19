package functions

// type ExecutorInputParams struct {
// 	Workflows []models.WorkflowStep
// 	Edges     []models.WorkflowEdge
// }

// type ExecutorResponse struct{}

// func Executor(params ExecutorInputParams) {
// 	for _, execStep := range params.Workflows {
// TODO: the execution is not serial, take into account the edges to calculate dependencies
// TODO: implement this with channels and go-routines for faster execution
// flowStepParam := flowStepParamType{
// 	FunctionName: execStep.FunctionName,
// 	Input:        execStep.Input,
// }

// flowStep := flowStepParam.getFlowStep()
// if flowStep == nil {
// 	fmt.Printf("executor function was not found for this flow")
// 	continue
// }

// if err := flowStep.preProcess(flowStepParam); err != nil {
// 	fmt.Println("error in flow preprocessing", err.Error())
// 	continue
// }

// if err := flowStep.execute(); err != nil {
// 	fmt.Println("error in flow execution", err.Error())
// 	continue
// }

// flowStepParam, err := flowStep.postProcess(flowStepParam)
// if err != nil {
// 	fmt.Println("error in flow postprocessing", err.Error())
// }
// }
// }

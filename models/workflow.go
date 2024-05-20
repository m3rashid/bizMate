package models

const WORKFLOW_MODEL_NAME string = "workflows"
const WORKFLOW_STEP_MODEL_NAME string = "workflow_steps"
const WORKFLOW_EXECUTION_LOGS_MODEL_NAME string = "workflow_execution_logs"

// not a model, just for parsing and validation
type WorkflowEdge struct {
	From uint `json:"from" validate:"required"`
	To   uint `json:"to" validate:"required"`
}

type Workflow struct {
	BaseModel
	CreatedBy
	UpdatedBy
	Name        string        `json:"name" gorm:"column:name;not null" validate:"required"`
	Description string        `json:"description" gorm:"column:description;not null" validate:"required"`
	Active      bool          `json:"active" gorm:"column:active;not null" validate:"required"`
	StartNodeID uint          `json:"startNodeId" gorm:"column:startNodeId;not null" validate:"required"`
	StartNode   *WorkflowStep `json:"startNode" gorm:"foreignKey:startNodeId;constraint:OnUpdate:CASCADE,OnDelete:CASCADE;" validate:""`
	EndNodeID   uint          `json:"endNodeId" gorm:"column:endNodeId;not null" validate:"required"`
	EndNode     *WorkflowStep `json:"endNode" gorm:"foreignKey:endNodeId;constraint:OnUpdate:CASCADE,OnDelete:CASCADE;" validate:""`
	Edges       string        `json:"edges" gorm:"column:edges;not null" validate:"required"`
}

type FunctionNameType string
type WorkflowStep struct {
	BaseModel
	CreatedBy
	UpdatedBy
	FunctionName FunctionNameType `json:"functionName" gorm:"functionName:name;not null" validate:"required"`
	Input        string           `json:"input" gorm:"input:name;not null" validate:"required"`
	WorkflowID   uint             `json:"workflowId" gorm:"column:workflowId;not null" validate:"required"`
	Workflow     *Workflow        `json:"workflow" gorm:"foreignKey:workflowId;constraint:OnUpdate:CASCADE,OnDelete:CASCADE;" validate:""`
}

type WorkflowExectionLog struct {
	BaseModel
	WorkflowStepID uint          `json:"workflowStepId" gorm:"column:workflowStepId;not null" validate:"required"`
	WorkflowStep   *WorkflowStep `json:"workflowStep" gorm:"foreignKey:workflowStepId;constraint:OnUpdate:CASCADE,OnDelete:CASCADE;" validate:""`
	Output         string        `json:"output" gorm:"input:name;not null" validate:"required"`
}

func (Workflow) TableName() string {
	return WORKFLOW_MODEL_NAME
}

func (WorkflowStep) TableName() string {
	return WORKFLOW_STEP_MODEL_NAME
}

func (WorkflowExectionLog) TableName() string {
	return WORKFLOW_EXECUTION_LOGS_MODEL_NAME
}

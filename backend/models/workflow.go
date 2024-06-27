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
	Name        string `json:"name" gorm:"column:name;not null" validate:"required"`
	Description string `json:"description" gorm:"column:description;not null" validate:"required"`
	Active      bool   `json:"active" gorm:"column:active;not null" validate:"required"`
	Edges       string `json:"edges" gorm:"column:edges;not null" validate:"required"`
}

var WorkflowJsonModel = DashboardIndexableJsonModel{
	ModelName: WORKFLOW_MODEL_NAME,
	Fields: map[string]JsonFieldType{
		"id":          JsonString,
		"name":        JsonString,
		"description": JsonString,
		"active":      JsonBool,
		"createdAt":   JsonDate,
	},
}

type FunctionNameType string
type WorkflowStep struct {
	BaseModel
	CreatedBy
	UpdatedBy
	FunctionName FunctionNameType `json:"functionName" gorm:"functionName:name;not null" validate:"required"`
	Input        string           `json:"input" gorm:"input:name;not null" validate:"required"`
	WorkflowID   uint             `json:"workflowId" gorm:"column:workflowId;not null" validate:"required"`
	Workflow     *Workflow        `json:"workflow" gorm:"foreignKey:workflowId;constraint:OnUpdate:CASCADE,OnDelete:CASCADE;"`
}

var WorkflowStepJsonModel = DashboardIndexableJsonModel{
	ModelName: WORKFLOW_STEP_MODEL_NAME,
	Fields: map[string]JsonFieldType{
		"id":           JsonString,
		"functionName": JsonString,
		"input":        JsonString,
		"workflowId":   JsonString,
		"createdAt":    JsonDate,
	},
}

type WorkflowExectionLog struct {
	BaseModel
	WorkflowStepID uint          `json:"workflowStepId" gorm:"column:workflowStepId;not null" validate:"required"`
	WorkflowStep   *WorkflowStep `json:"workflowStep" gorm:"foreignKey:workflowStepId;constraint:OnUpdate:CASCADE,OnDelete:CASCADE;"`
	Output         string        `json:"output" gorm:"input:name;not null" validate:"required"`
}

var WorkflowExectionLogJsonModel = DashboardIndexableJsonModel{
	ModelName: WORKFLOW_EXECUTION_LOGS_MODEL_NAME,
	Fields: map[string]JsonFieldType{
		"id":             JsonString,
		"workflowStepId": JsonString,
		"output":         JsonString,
		"createdAt":      JsonDate,
	},
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

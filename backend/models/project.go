package models

import "time"

const TAG_MODEL_NAME string = "project_tags"
const TASK_MODEL_NAME string = "project_tasks"
const PROJECT_MODEL_NAME string = "projects"
const PROJECT_CYCLE_MODEL_NAME = "project_cycles"
const PROJECT_TASK_EVENT_MODEL_NAME = "project_task_comments"

type TaskStatus string

const (
	TaskStatusBacklog    TaskStatus = "backlog"
	TaskStatusTodo       TaskStatus = "todo"
	TaskStatusInProgress TaskStatus = "inprogress"
	TaskStatusReview     TaskStatus = "review"
	TaskStatusDone       TaskStatus = "done"
)

type ProjectCycle struct {
	BaseModelWithWorkspace
	CreatedBy
	UpdatedBy
	CycleGoals     string    `json:"cycleGoals" gorm:"column:cycleGoals"`
	ProjectID      string    `json:"projectId" gorm:"type:uuid;column:projectId;not null" validate:"required"`
	CycleDaysCount int       `json:"cycleDaysCount" gorm:"column:cycleDaysCount;not null" validate:"required"`
	Project        *Project  `json:"project" gorm:"foreignKey:projectId;constraint:OnUpdate:CASCADE,OnDelete:CASCADE;"`
	StartDay       time.Time `json:"startDay" gorm:"column:startDay;not null" validate:"required"`
}

var ProjectCycleJsonModel = DashboardIndexableJsonModel{
	ModelName: PROJECT_CYCLE_MODEL_NAME,
	Fields: map[string]JsonFieldType{
		"id":             JsonNumber,
		"startDay":       JsonDate,
		"createdAt":      JsonDate,
		"createdBy":      JsonCreatedBy,
		"projectId":      JsonNumber,
		"cycleGoals":     JsonString,
		"cycleDaysCount": JsonNumber,
	},
}

type Project struct {
	BaseModelWithWorkspace
	CreatedBy
	UpdatedBy
	Name        string  `json:"name" gorm:"column:name;not null" validate:"required"`
	Description string  `json:"description" gorm:"column:description;not null" validate:"required"`
	Abandoned   bool    `json:"abandoned" gorm:"column:abandoned;default:false"`
	Completed   bool    `json:"completed" gorm:"column:completed;default:false"`
	Readme      string  `json:"readme" gorm:"column:readme"`
	Guidelines  string  `json:"guidelines" gorm:"column:guidelines"`
	Docs        string  `json:"docs" gorm:"column:docs"`
	People      []*User `json:"users" gorm:"many2many:users_project_relation"`
}

var ProjectJsonModel = DashboardIndexableJsonModel{
	ModelName: PROJECT_MODEL_NAME,
	Fields: map[string]JsonFieldType{
		"id":          JsonNumber,
		"name":        JsonString,
		"abandoned":   JsonBool,
		"completed":   JsonBool,
		"createdAt":   JsonDate,
		"createdBy":   JsonCreatedBy,
		"description": JsonString,
	},
}

type ProjectTag struct {
	BaseModelWithWorkspace
	Name string `json:"name" gorm:"column:name;not null" validate:"required"`
}

var ProjectTagJsonModel = DashboardIndexableJsonModel{
	ModelName: TAG_MODEL_NAME,
	Fields: map[string]JsonFieldType{
		"id":        JsonNumber,
		"name":      JsonString,
		"createdAt": JsonDate,
	},
}

type ProjectTask struct {
	BaseModelWithWorkspace
	CreatedBy
	UpdatedBy
	Title        string        `json:"title" gorm:"column:title;not null" validate:"required"`
	Description  string        `json:"description" gorm:"column:description;not null" validate:"required"`
	Status       TaskStatus    `json:"status" gorm:"column:status;not null" validate:"required"`
	Deadline     time.Time     `json:"deadline" gorm:"column:deadline" validate:""`
	ProjectID    string        `json:"projectId" gorm:"type:uuid;column:projectId;not null" validate:"required"`
	Project      *Project      `json:"project" gorm:"foreignKey:projectId;constraint:OnUpdate:CASCADE,OnDelete:CASCADE;"`
	Assinees     []*User       `json:"users" gorm:"many2many:users_task_relation"`
	Tags         []*ProjectTag `json:"tags" gorm:"many2many:tags_task_relation"`
	ParentTaskID *string       `json:"parentTaskId" gorm:"type:uuid;column:parentTaskId"`
	ParentTask   *ProjectTask  `json:"parentTask" gorm:"foreignKey:parentTaskId;constraint:OnUpdate:CASCADE,OnDelete:CASCADE;"`
}

var ProjectTaskJsonModel = DashboardIndexableJsonModel{
	ModelName: TASK_MODEL_NAME,
	Fields: map[string]JsonFieldType{
		"id":           JsonNumber,
		"title":        JsonString,
		"status":       JsonString,
		"deadline":     JsonDate,
		"createdAt":    JsonDate,
		"createdBy":    JsonCreatedBy,
		"projectId":    JsonNumber,
		"description":  JsonString,
		"parentTaskId": JsonNumber,
	},
}

type ProjectTaskEventType string

const (
	ProjectTaskEventAddComment     ProjectTaskEventType = "add_comment"
	ProjectTaskEventEditComment    ProjectTaskEventType = "edit_comment"
	ProjectTaskEventDeleteComment  ProjectTaskEventType = "delete_comment"
	ProjectTaskEventStatusChange   ProjectTaskEventType = "status_change"
	ProjectTaskEventAddAssignee    ProjectTaskEventType = "add_assignee"
	ProjectTaskEventRemoveAssignee ProjectTaskEventType = "remove_assignee"
	ProjectTaskEventAddTag         ProjectTaskEventType = "add_tag"
	ProjectTaskEventRemoveTag      ProjectTaskEventType = "remove_tag"
)

type ProjectTaskEvent struct {
	BaseModelWithWorkspace
	CreatedBy
	UpdatedBy
	TaskID string               `json:"taskId" gorm:"type:uuid;column:taskId;not null" validate:"required"`
	Task   *ProjectTask         `json:"task" gorm:"foreignKey:taskId;constraint:OnUpdate:CASCADE,OnDelete:CASCADE;"`
	Type   ProjectTaskEventType `json:"type" gorm:"column:type;not null" validate:"required"`
	Data   string               `json:"data" gorm:"column:data;not null" validate:"required"` // the actual change that happened
}

var ProjectTaskEventJsonModel = DashboardIndexableJsonModel{
	ModelName: PROJECT_TASK_EVENT_MODEL_NAME,
	Fields: map[string]JsonFieldType{
		"id":        JsonNumber,
		"type":      JsonString,
		"data":      JsonString,
		"taskId":    JsonNumber,
		"createdAt": JsonDate,
		"createdBy": JsonCreatedBy,
	},
}

func (Project) TableName() string {
	return PROJECT_MODEL_NAME
}

func (ProjectTag) TableName() string {
	return TAG_MODEL_NAME
}

func (ProjectTask) TableName() string {
	return TASK_MODEL_NAME
}

func (ProjectTaskEvent) TableName() string {
	return PROJECT_TASK_EVENT_MODEL_NAME
}

func (ProjectCycle) TableName() string {
	return PROJECT_CYCLE_MODEL_NAME
}

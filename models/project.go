package models

import "time"

const TAG_MODEL_NAME string = "project_tags"
const TASK_MODEL_NAME string = "project_tasks"
const PROJECT_MODEL_NAME string = "projects"
const PROJECT_CYCLE_MODEL_NAME = "project_cycles"
const PROJECT_TASK_COMMENT_MODEL_NAME = "project_task_comments"

type TaskStatus string

const (
	TaskStatusBacklog    TaskStatus = "backlog"
	TaskStatusTodo       TaskStatus = "todo"
	TaskStatusInProgress TaskStatus = "inprogress"
	TaskStatusReview     TaskStatus = "review"
	TaskStatusDone       TaskStatus = "done"
)

type ProjectCycle struct {
	BaseModel
	CreatedBy
	UpdatedBy
	CycleGoals     string    `json:"cycleGoals" gorm:"column:cycleGoals"`
	ProjectID      uint      `json:"projectId" gorm:"column:projectId;not null" validate:"required"`
	CycleDaysCount int       `json:"cycleDaysCount" gorm:"column:cycleDaysCount;not null" validate:"required"`
	Project        *Project  `json:"project" gorm:"foreignKey:projectId;constraint:OnUpdate:CASCADE,OnDelete:CASCADE;"`
	StartDay       time.Time `json:"startDay" gorm:"column:startDay;not null" validate:"required"`
}

type Project struct {
	BaseModel
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

type ProjectTag struct {
	BaseModel
	Name string `json:"name" gorm:"column:name;not null" validate:"required"`
}

type ProjectTask struct {
	BaseModel
	CreatedBy
	UpdatedBy
	Title        string        `json:"title" gorm:"column:title;not null" validate:"required"`
	Description  string        `json:"description" gorm:"column:description;not null" validate:"required"`
	Status       TaskStatus    `json:"status" gorm:"column:status;not null" validate:"required"`
	Deadline     time.Time     `json:"deadline" gorm:"column:deadline" validate:""`
	ProjectID    uint          `json:"projectId" gorm:"column:projectId;not null" validate:"required"`
	Project      *Project      `json:"project" gorm:"foreignKey:projectId;constraint:OnUpdate:CASCADE,OnDelete:CASCADE;"`
	Assinees     []*User       `json:"users" gorm:"many2many:users_task_relation"`
	Tags         []*ProjectTag `json:"tags" gorm:"many2many:tags_task_relation"`
	ParentTaskID *uint         `json:"parentTaskId" gorm:"column:parentTaskId"`
	ParentTask   *ProjectTask  `json:"parentTask" gorm:"foreignKey:parentTaskId;constraint:OnUpdate:CASCADE,OnDelete:CASCADE;"`
}

type ProjectTaskComment struct {
	BaseModel
	CreatedBy
	UpdatedBy
	Comment string       `json:"comment" gorm:"column:comment;not null" validate:"required"`
	TaskID  uint         `json:"taskId" gorm:"column:taskId;not null" validate:"required"`
	Task    *ProjectTask `json:"task" gorm:"foreignKey:taskId;constraint:OnUpdate:CASCADE,OnDelete:CASCADE;"`
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

func (ProjectTaskComment) TableName() string {
	return PROJECT_TASK_COMMENT_MODEL_NAME
}

func (ProjectCycle) TableName() string {
	return PROJECT_CYCLE_MODEL_NAME
}

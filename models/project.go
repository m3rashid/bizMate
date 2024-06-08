package models

import "time"

const TAG_MODEL_NAME string = "tags"
const TASK_MODEL_NAME string = "tasks"
const PROJECT_MODEL_NAME string = "projects"
const PROJECT_TASK_COMMENT_MODEL_NAME = "project_task_comments"

type TaskStatus string

const (
	TaskStatusBacklog    TaskStatus = "backlog"
	TaskStatusTodo       TaskStatus = "todo"
	TaskStatusInProgress TaskStatus = "inprogress"
	TaskStatusReview     TaskStatus = "review"
	TaskStatusDone       TaskStatus = "done"
)

type Project struct {
	BaseModel
	CreatedBy
	UpdatedBy
	Name          string  `json:"name" gorm:"column:name;not null" validate:"required"`
	Description   string  `json:"description" gorm:"column:description;not null" validate:"required"`
	Abandoned     bool    `json:"abandoned" gorm:"column:abandoned;default:false"`
	Completed     bool    `json:"completed" gorm:"column:completed;default:false"`
	Readme        string  `json:"readme" gorm:"column:readme"`
	Guidelines    string  `json:"guidelines" gorm:"column:guidelines"`
	Documentation string  `json:"documentation" gorm:"column:documentation"`
	People        []*User `json:"users" gorm:"many2many:users_project_relation"`
}

type Tag struct {
	BaseModel
	Name string `json:"name" gorm:"column:name;not null" validate:"required"`
}

type Task struct {
	BaseModel
	CreatedBy
	UpdatedBy
	Title        string     `json:"title" gorm:"column:title;not null" validate:"required"`
	Description  string     `json:"description" gorm:"column:description;not null" validate:"required"`
	Status       TaskStatus `json:"status" gorm:"column:status;not null" validate:"required"`
	Deadline     time.Time  `json:"deadline" gorm:"column:deadline" validate:""`
	ProjectID    uint       `json:"projectId" gorm:"column:projectId;not null" validate:"required"`
	Project      *Project   `json:"project" gorm:"foreignKey:projectId;constraint:OnUpdate:CASCADE,OnDelete:CASCADE;"`
	Assinees     []*User    `json:"users" gorm:"many2many:users_task_relation"`
	Tags         []*Tag     `json:"tags" gorm:"many2many:tags_task_relation"`
	ParentTaskID uint       `json:"parentTaskId" gorm:"column:parentTaskId"`
	ParentTask   *Task      `json:"parentTask" gorm:"foreignKey:parentTaskId;constraint:OnUpdate:CASCADE,OnDelete:CASCADE;"`
}

type ProjectTaskComment struct {
	BaseModel
	CreatedBy
	UpdatedBy
	Comment string `json:"comment" gorm:"column:comment;not null" validate:"required"`
	TaskID  uint   `json:"taskId" gorm:"column:taskId;not null" validate:"required"`
	Task    *Task  `json:"task" gorm:"foreignKey:taskId;constraint:OnUpdate:CASCADE,OnDelete:CASCADE;"`
}

func (Project) TableName() string {
	return PROJECT_MODEL_NAME
}

func (Tag) TableName() string {
	return TAG_MODEL_NAME
}

func (Task) TableName() string {
	return TASK_MODEL_NAME
}

func (ProjectTaskComment) TableName() string {
	return PROJECT_TASK_COMMENT_MODEL_NAME
}

package projects

import (
	"bizMate/models"
	"time"
)

type projectReqBody struct {
	Name        string         `json:"name" validate:"required"`
	Description string         `json:"description"`
	Abandoned   *bool          `json:"abandoned"`
	Completed   *bool          `json:"completed"`
	People      []*models.User `json:"users" gorm:"many2many:users_project_relation"`
}

type projectEditReqBody struct {
	Name        string         `json:"name"`
	Description string         `json:"description"`
	Abandoned   *bool          `json:"abandoned"`
	Completed   *bool          `json:"completed"`
	Readme      string         `json:"readme" gorm:"column:readme"`
	Guidelines  string         `json:"guidelines" gorm:"column:guidelines"`
	Docs        string         `json:"docs" gorm:"column:docs"`
	People      []*models.User `json:"users" gorm:"many2many:users_project_relation"`
}

type ProjectTaskReqBody struct {
	Title        string               `json:"title" validate:"required"`
	Description  string               `json:"description"`
	Status       models.TaskStatus    `json:"status" validate:"required"`
	Deadline     time.Time            `json:"deadline" validate:""`
	ProjectID    string               `json:"projectId" validate:"required"`
	Assinees     []*models.User       `json:"users" gorm:"many2many:users_task_relation"`
	Tags         []*models.ProjectTag `json:"tags" gorm:"many2many:tags_task_relation"`
	ParentTaskID *string              `json:"parentTaskId"`
}

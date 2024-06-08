package project

import "bizmate/models"

type projectReqBody struct {
	Name        string         `json:"name" validate:"required"`
	Description string         `json:"description" validate:"required"`
	Abandoned   *bool          `json:"abandoned"`
	Completed   *bool          `json:"completed"`
	People      []*models.User `json:"users" gorm:"many2many:users_project_relation"`
}

type projectEditReqBody struct {
	Name          string         `json:"name"`
	Description   string         `json:"description"`
	Abandoned     *bool          `json:"abandoned"`
	Completed     *bool          `json:"completed"`
	Readme        string         `json:"readme" gorm:"column:readme"`
	Guidelines    string         `json:"guidelines" gorm:"column:guidelines"`
	Documentation string         `json:"documentation" gorm:"column:documentation"`
	People        []*models.User `json:"users" gorm:"many2many:users_project_relation"`
}

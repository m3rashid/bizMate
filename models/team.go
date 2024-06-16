package models

const TEAM_MODEL_NAME string = "teams"

type Team struct {
	BaseModel
	CreatedBy
	UpdatedBy
	Name   string  `json:"name" gorm:"column:name;not null" validate:"required"`
	People []*User `json:"users" gorm:"many2many:users_team_relation"`
}

func (Team) TableName() string {
	return TEAM_MODEL_NAME
}

package models

const NOTIFICATION_MODEL_NAME = "notifications"

const SCOPE_TENANT = "tenant"
const SCOPE_USER = "user"

type Notification struct {
	BaseModel
	Title       string `json:"title" gorm:"column:title;not null" validate:"required"`
	Description string `json:"description,omitempty" gorm:"column:description" validate:""`
	Link        string `json:"link,omitempty" gorm:"column:link" validate:""`
	Scope       string `json:"scope" gorm:"column:scope;not null" validate:"required"`
	Read        bool   `json:"read" gorm:"column:read" validate:"required"`
}

func (*Notification) TableName() string {
	return NOTIFICATION_MODEL_NAME
}

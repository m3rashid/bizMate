package models

const NOTIFICATION_MODEL_NAME string = "notifications"

const (
	SCOPE_USER   = "user"
	SCOPE_TENANT = "tenant"
)

type WebUiNotification struct {
	BaseModel
	Title       string `json:"title" gorm:"column:title;not null" validate:"required"`
	Description string `json:"description" gorm:"column:description"`
	Link        string `json:"link" gorm:"column:link"`
	Scope       string `json:"scope" gorm:"column:scope;not null" validate:"required"`
	Read        bool   `json:"read" gorm:"column:read" validate:"required"`
}

func (WebUiNotification) TableName() string {
	return NOTIFICATION_MODEL_NAME
}

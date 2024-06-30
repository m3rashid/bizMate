package models

// TODO: move notifications to mongodb

const USER_WEB_UI_NOTIFICATION_MODEL_NAME string = "user_webui_notifications"
const WORKSPACE_WEB_UI_NOTIFICATION_MODEL_NAME string = "workspace_webui_notifications"

type UserWebUiNotification struct {
	BaseModelWithWorkspace
	Title       string `json:"title" gorm:"column:title;not null" validate:"required"`
	Description string `json:"description" gorm:"column:description"`
	Link        string `json:"link" gorm:"column:link"`
	Read        bool   `json:"read" gorm:"column:read" validate:"required"`
}

type WorkspaceWebUiNotification struct {
	BaseModelWithWorkspace
	Title       string `json:"title" gorm:"column:title;not null" validate:"required"`
	Description string `json:"description" gorm:"column:description"`
	Link        string `json:"link" gorm:"column:link"`
	ReadBy      string `json:"read" gorm:"column:read" validate:"required"` // array of user ids
}

func (WorkspaceWebUiNotification) TableName() string {
	return WORKSPACE_WEB_UI_NOTIFICATION_MODEL_NAME
}

func (UserWebUiNotification) TableName() string {
	return USER_WEB_UI_NOTIFICATION_MODEL_NAME
}

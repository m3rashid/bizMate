package models

const NOTIFICATION_MODEL_NAME string = "notifications"
const EMAIL_TEMPLATE_MODEL_NAME string = "email_templates"
const BULK_EMAIL_REQUEST_MODEL_NAME string = "bulk_email_requests"

const SCOPE_USER = "user"
const SCOPE_TENANT = "tenant"

type WebUiNotification struct {
	BaseModel
	Title       string `json:"title" gorm:"column:title;not null" validate:"required"`
	Description string `json:"description,omitempty" gorm:"column:description"`
	Link        string `json:"link,omitempty" gorm:"column:link"`
	Scope       string `json:"scope" gorm:"column:scope;not null" validate:"required"`
	Read        bool   `json:"read" gorm:"column:read" validate:"required"`
}

type EmailTemplate struct {
	BaseModel
	CreatedBy
	UpdatedBy
	Title           string `json:"title" gorm:"column:title;not null" validate:"required"`
	Description     string `json:"description,omitempty" gorm:"column:description"`
	Variables       string `json:"variables,omitempty" gorm:"column:variables"` // array of strings to be replaced
	SubjectTemplate string `json:"subjectTemplate,omitempty" gorm:"column:subjectTemplate;not null" validate:"required"`
	BodyTemplate    string `json:"bodyTemplate" gorm:"column:bodyTemplate;not null" validate:"required"`
}

type BulkEmailRequest struct {
	BaseModel
	CreatedBy
	EmailTemplateID        uint           `json:"emailTemplateId" gorm:"column:emailTemplateId;not null" validate:"required"`
	EmailTemplate          *EmailTemplate `json:"emailTemplate" gorm:"foreignKey:emailTemplateId;constraint:OnUpdate:CASCADE,OnDelete:CASCADE;"`
	BodyVariableMapping    string         `json:"bodyVariableMapping,omitempty" gorm:"column:bodyVariableMapping"`
	SubjectVariableMapping string         `json:"subjectVariableMapping,omitempty" gorm:"column:subjectVariableMapping"`
}

func (WebUiNotification) TableName() string {
	return NOTIFICATION_MODEL_NAME
}

func (EmailTemplate) TableName() string {
	return EMAIL_TEMPLATE_MODEL_NAME
}

func (BulkEmailRequest) TableName() string {
	return BULK_EMAIL_REQUEST_MODEL_NAME
}

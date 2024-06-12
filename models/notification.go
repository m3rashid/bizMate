package models

const NOTIFICATION_MODEL_NAME string = "notifications"
const EMAIL_TEMPLATE_MODEL_NAME string = "email_templates"
const BULK_EMAIL_REQUEST_MODEL_NAME string = "bulk_email_requests"

const SCOPE_USER = "user"
const SCOPE_TENANT = "tenant"

type WebUiNotification struct {
	BaseModel
	Title       string `json:"title" gorm:"column:title;not null" validate:"required"`
	Description string `json:"description" gorm:"column:description"`
	Link        string `json:"link" gorm:"column:link"`
	Scope       string `json:"scope" gorm:"column:scope;not null" validate:"required"`
	Read        bool   `json:"read" gorm:"column:read" validate:"required"`
}

type EmailTemplate struct {
	BaseModel
	CreatedBy
	UpdatedBy
	Title                  string `json:"title" gorm:"column:title;not null" validate:"required"`
	Description            string `json:"description" gorm:"column:description"`
	Variables              string `json:"variables" gorm:"column:variables" validate:"required"` // array of strings to be replaced
	SubjectTemplate        string `json:"subjectTemplate" gorm:"column:subjectTemplate;not null" validate:"required"`
	BodyTemplateHtml       string `json:"bodyTemplateHtml" gorm:"column:bodyTemplateHtml;not null" validate:"required"`
	BodyTemplateDesignJson string `json:"bodyTemplateDesignJson" gorm:"column:bodyTemplateDesignJson;not null" validate:"required"`
}

type BulkEmailRequest struct {
	BaseModel
	CreatedBy
	EmailTemplateID        uint           `json:"emailTemplateId" gorm:"column:emailTemplateId;not null" validate:"required"`
	EmailTemplate          *EmailTemplate `json:"emailTemplate" gorm:"foreignKey:emailTemplateId;constraint:OnUpdate:CASCADE,OnDelete:CASCADE;"`
	BodyVariableMapping    string         `json:"bodyVariableMapping" gorm:"column:bodyVariableMapping"`
	SubjectVariableMapping string         `json:"subjectVariableMapping" gorm:"column:subjectVariableMapping"`
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

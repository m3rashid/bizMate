package models

const FORM_MODEL_NAME = "forms"
const FORM_RESPONSE_MODEL_NAME = "form_responses"

type Form struct {
	BaseModel
	CreatedBy
	UpdatedBy
	Title                  string `json:"title" gorm:"column:title;not null" validate:"required"`
	Description            string `json:"description" gorm:"column:description;not null" validate:"required"`
	Body                   string `json:"body" gorm:"column:body;not null" validate:"required"`
	SubmitText             string `json:"submitText" gorm:"column:submitText;not null" validate:"required"`
	CancelText             string `json:"cancelText" gorm:"column:cancelText;not null" validate:"required"`
	SuccessPage            string `json:"successPage,omitempty" gorm:"column:successPage" validate:""`
	FailurePage            string `json:"failurePage,omitempty" gorm:"column:failurePage" validate:""`
	Active                 bool   `json:"active" gorm:"column:active;not null" validate:"required"`
	AllowAnonymousResponse bool   `json:"allowAnonymousResponse" gorm:"column:allowAnonymousResponse;not null" validate:"required"`
	AllowResponseUpdate    bool   `json:"allowResponseUpdate" gorm:"column:allowResponseUpdate;not null" validate:"required"`
	AllowMultipleResponse  bool   `json:"allowMultipleResponse" gorm:"column:allowMultipleResponse;not null" validate:"required"`
	PreviousVersionIDs     string `json:"previousVersionIDs,omitempty" gorm:"column:previousVersionIDs" validate:"required"`
}

type FormResponse struct {
	BaseModel
	UpdatedBy
	OptionalCreatedBy
	FormID   uint   `json:"formId" gorm:"column:formId;not null" validate:"required"`
	Form     *Form  `json:"form" gorm:"foreignKey:formId;constraint:OnUpdate:CASCADE,OnDelete:CASCADE;" validate:""`
	Response string `json:"response" gorm:"column:response;not null" validate:"required"`
	DeviceIP string `json:"deviceIp,omitempty" gorm:"column:deviceIp" validate:""`
}

func (*Form) TableName() string {
	return FORM_MODEL_NAME
}

func (*FormResponse) TableName() string {
	return FORM_RESPONSE_MODEL_NAME
}

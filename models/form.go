package models

const FORM_MODEL_NAME string = "forms"
const FORM_RESPONSE_MODEL_NAME string = "form_responses"

type Form struct {
	BaseModel
	CreatedBy
	UpdatedBy
	Title                  string `json:"title" gorm:"column:title;not null" validate:"required"`
	Description            string `json:"description" gorm:"column:description;not null" validate:"required"`
	Body                   string `json:"body" gorm:"column:body;not null" validate:"required"`
	SubmitText             string `json:"submitText" gorm:"column:submitText;not null" validate:"required"`
	CancelText             string `json:"cancelText" gorm:"column:cancelText;not null" validate:"required"`
	SuccessPage            string `json:"successPage,omitempty" gorm:"column:successPage"`
	FailurePage            string `json:"failurePage,omitempty" gorm:"column:failurePage"`
	Active                 bool   `json:"active" gorm:"column:active;default:false"`
	SendResponseEmail      bool   `json:"sendResponseEmail" gorm:"column:sendResponseEmail;default:false"`
	AllowAnonymousResponse bool   `json:"allowAnonymousResponse" gorm:"column:allowAnonymousResponse;default:true"`
	AllowResponseUpdate    bool   `json:"allowResponseUpdate" gorm:"column:allowResponseUpdate;default:false"`
	AllowMultipleResponse  bool   `json:"allowMultipleResponse" gorm:"column:allowMultipleResponse;default:false"`
	PreviousVersionIDs     string `json:"previousVersionIDs,omitempty" gorm:"column:previousVersionIDs;default:[]" validate:"required"`
}

type FormResponse struct {
	BaseModel
	UpdatedBy
	OptionalCreatedBy
	FormID   uint   `json:"formId" gorm:"column:formId;not null" validate:"required"`
	Form     *Form  `json:"form" gorm:"foreignKey:formId;constraint:OnUpdate:CASCADE,OnDelete:CASCADE;"`
	Response string `json:"response" gorm:"column:response;not null" validate:"required"`
	DeviceIP string `json:"deviceIp,omitempty" gorm:"column:deviceIp"`
}

func (Form) TableName() string {
	return FORM_MODEL_NAME
}

func (FormResponse) TableName() string {
	return FORM_RESPONSE_MODEL_NAME
}

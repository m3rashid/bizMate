package models

const FORM_MODEL_NAME = "forms"

type Form struct {
	BaseModel
	Header             string `json:"header" gorm:"column:header;not null" validate:"required"`
	Body               string `json:"body" gorm:"column:body;not null" validate:"required"`
	Footer             string `json:"footer" gorm:"column:footer;not null" validate:"required"`
	SuccessPage        string `json:"successPage,omitempty" gorm:"column:successPage" validate:""`
	FailurePage        string `json:"failurePage,omitempty" gorm:"column:failurePage" validate:""`
	PreviousVersionIDs string `json:"previousVersionIDs,omitempty" gorm:"column:previousVersionIDs" validate:""`
	//
	// `json:"" gorm:"column:" validate:""`
	// `json:"" gorm:"column:" validate:""`
}

func (*Form) TableName() string {
	return FORM_MODEL_NAME
}

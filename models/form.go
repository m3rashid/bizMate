package models

const FORM_MODEL_NAME = "forms"
const FORM_RESPONSE_MODEL_NAME = "form_responses"

type Form struct {
	BaseModel
	Title              string `json:"title" gorm:"column:title;not null" validate:"required"`
	Description        string `json:"description" gorm:"column:description;not null" validate:"required"`
	Body               string `json:"body" gorm:"column:body;not null" validate:"required"`
	SubmitText         string `json:"submitText" gorm:"column:submitText;not null" validate:"required"`
	CancelText         string `json:"cancelText" gorm:"column:cancelText;not null" validate:"required"`
	AuthRequired       bool   `json:"authRequired" gorm:"column:authRequired;not null" validate:"required"`
	SuccessPage        string `json:"successPage,omitempty" gorm:"column:successPage" validate:""`
	FailurePage        string `json:"failurePage,omitempty" gorm:"column:failurePage" validate:""`
	Active             bool   `json:"active" gorm:"column:active;not null" validate:"required"`
	PreviousVersionIDs string `json:"previousVersionIDs,omitempty" gorm:"column:previousVersionIDs" validate:"required"`
}

type FormResponse struct {
	BaseModel
	FormID   uint   `json:"formId" gorm:"column:formId;not null" validate:"required"`
	Response string `json:"response" gorm:"column:response;not null" validate:"required"`
	IP       string `json:"ip,omitempty" gorm:"column:ip" validate:""`
	UserID   uint   `json:"userId,omitempty" gorm:"column:userId" validate:""`
	User     *User  `json:"user,omitempty" gorm:"column:userId;constraint:OnUpdate:CASCADE,OnDelete:CASCADE;" validate:""`
}

func (*Form) TableName() string {
	return FORM_MODEL_NAME
}

func (*FormResponse) TableName() string {
	return FORM_RESPONSE_MODEL_NAME
}

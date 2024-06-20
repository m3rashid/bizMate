package models

import "encoding/json"

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

var FormJsonModel = DashboardIndexableJsonModel{
	ModelName: FORM_MODEL_NAME,
	Fields: map[string]JsonFieldType{
		"id":                     JsonNumber,
		"title":                  JsonString,
		"active":                 JsonBool,
		"createdBy":              JsonCreatedBy,
		"updatedBy":              JsonCreatedBy,
		"createdAt":              JsonDate,
		"description":            JsonString,
		"sendResponseEmail":      JsonBool,
		"allowAnonymousResponse": JsonBool,
		"allowResponseUpdate":    JsonBool,
		"allowMultipleResponse":  JsonBool,
	},
}

func (Form) TableName() string {
	return FORM_MODEL_NAME
}

func (f *Form) GetFormElements() ([]FormElementInstanceType, error) {
	elements := []FormElementInstanceType{}
	if err := json.Unmarshal([]byte((*f).Body), &elements); err != nil {
		return elements, err
	}

	return elements, nil
}

func (f *Form) GetInputElements() ([]FormElementInstanceType, error) {
	inputElements := []FormElementInstanceType{}

	elements, err := f.GetFormElements()
	if err != nil {
		return inputElements, err
	}

	for _, element := range elements {
		if _, ok := element.Props["name"]; ok && element.Name.IsFormInputElement() {
			inputElements = append(inputElements, element)
		}
	}

	return inputElements, nil
}

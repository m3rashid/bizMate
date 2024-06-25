package models

import "encoding/json"

type FormResponse struct {
	BaseModel
	UpdatedBy
	OptionalCreatedBy
	FormID   uint   `json:"formId" gorm:"column:formId;not null" validate:"required"`
	Form     *Form  `json:"form" gorm:"foreignKey:formId;constraint:OnUpdate:CASCADE,OnDelete:CASCADE;"`
	Response string `json:"response" gorm:"column:response;not null" validate:"required"`
	DeviceIP string `json:"deviceIp" gorm:"column:deviceIp"`
}

var FormResponseJsonModel = DashboardIndexableJsonModel{
	ModelName: FORM_RESPONSE_MODEL_NAME,
	Fields: map[string]JsonFieldType{
		"id":        JsonNumber,
		"formId":    JsonNumber,
		"createdBy": JsonCreatedBy,
		"createdAt": JsonDate,
	},
}

func (FormResponse) TableName() string {
	return FORM_RESPONSE_MODEL_NAME
}

func (f *FormResponse) GetResponse() (map[string]string, error) {
	responses := map[string]string{}
	if err := json.Unmarshal([]byte((*f).Response), &responses); err != nil {
		return responses, err
	}

	return responses, nil
}

func (f *FormResponse) GetValues(form Form) (map[string]string, error) {
	formResponseValues := map[string]string{}
	formInputElements, err := form.GetInputElements()
	if err != nil {
		return formResponseValues, err
	}

	formResponses, err := f.GetResponse()
	if err != nil {
		return formResponseValues, err
	}

	for _, formElement := range formInputElements {
		if _, ok := formElement.Props["name"]; !ok {
			continue
		}
		if _, ok := formElement.Props["label"]; !ok {
			continue
		}

		if val, ok := formResponses[formElement.Props["name"].(string)]; ok {
			formResponseValues[formElement.Props["label"].(string)] = val
		}
	}
	return formResponseValues, nil
}

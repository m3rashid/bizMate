package models

var FormResponseJsonModel = DashboardIndexableJsonModel{
	ModelName: FORM_RESPONSE_MODEL_NAME,
	Fields: map[string]JsonFieldType{
		"id":        JsonString,
		"formId":    JsonNumber,
		"createdBy": JsonCreatedBy,
		"createdAt": JsonDate,
	},
}

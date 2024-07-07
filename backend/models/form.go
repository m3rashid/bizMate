package models

const FORM_MODEL_NAME string = "forms"
const FORM_RESPONSE_MODEL_NAME string = "form_responses"

var FormJsonModel = DashboardIndexableJsonModel{
	ModelName: FORM_MODEL_NAME,
	Fields: map[string]JsonFieldType{
		"id":                     JsonString,
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

package models

const CONTACT_MODEL_NAME string = "contacts"

var ContactJsonModel = DashboardIndexableJsonModel{
	ModelName: CONTACT_MODEL_NAME,
	Fields: map[string]JsonFieldType{
		"id":        JsonString,
		"name":      JsonString,
		"email":     JsonString,
		"phone":     JsonString,
		"birthday":  JsonDate,
		"createdAt": JsonDate,
		"createdBy": JsonCreatedBy,
	},
}

package models

var FormResponseJsonModel = DashboardIndexableJsonModel{
	ModelName: FORM_RESPONSE_MODEL_NAME,
	Fields: map[string]JsonFieldType{
		"id":            JsonString,
		"form_d":        JsonNumber,
		"created_by_id": JsonCreatedBy,
		"created_at":    JsonDate,
	},
}

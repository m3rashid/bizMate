package models

const EMAIL_TEMPLATE_MODEL_NAME string = "email_templates"
const BULK_EMAIL_REQUEST_MODEL_NAME string = "bulk_email_requests"

var EmailTemplateJsonModel = DashboardIndexableJsonModel{
	ModelName: EMAIL_TEMPLATE_MODEL_NAME,
	Fields: map[string]JsonFieldType{
		"id":          JsonString,
		"title":       JsonString,
		"description": JsonString,
		"variables":   JsonString,
	},
}

var BulkEmailRequestJsonModel = DashboardIndexableJsonModel{
	ModelName: BULK_EMAIL_REQUEST_MODEL_NAME,
	Fields: map[string]JsonFieldType{
		"id":              JsonString,
		"createdAt":       JsonDate,
		"createdBy":       JsonCreatedBy,
		"emailTemplateId": JsonNumber,
	},
}

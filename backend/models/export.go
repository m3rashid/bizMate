package models

const TABLE_EXPORT_LOGS_MODEL_NAME = "table_export_logs"

var TableExportLogJsonModel = DashboardIndexableJsonModel{
	ModelName: TABLE_EXPORT_LOGS_MODEL_NAME,
	Fields: map[string]JsonFieldType{
		"id":        JsonString,
		"createdAt": JsonDate,
		"createdBy": JsonCreatedBy,
	},
}

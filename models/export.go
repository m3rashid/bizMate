package models

const TABLE_EXPORT_LOGS_MODEL_NAME = "table_export_logs"

type TableExportLog struct {
	BaseModel
	CreatedBy
}

func (TableExportLog) TableName() string {
	return TABLE_EXPORT_LOGS_MODEL_NAME
}

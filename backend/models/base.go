package models

type JsonFieldType string

const (
	JsonString    JsonFieldType = "string"
	JsonNumber    JsonFieldType = "number"
	JsonBool      JsonFieldType = "boolean"
	JsonObject    JsonFieldType = "object"
	JsonArray     JsonFieldType = "array"
	JsonNull      JsonFieldType = "null"
	JsonDate      JsonFieldType = "date"
	JsonCreatedBy JsonFieldType = "createdBy"
)

type DashboardIndexableJsonModel struct {
	Fields    map[string]JsonFieldType `json:"fields"`
	ModelName string                   `json:"modelName"`
}

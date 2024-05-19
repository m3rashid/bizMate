package dashboard

import "bizmate/models"

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

var UserJsonModel = DashboardIndexableJsonModel{
	ModelName: models.USER_MODEL_NAME,
	Fields: map[string]JsonFieldType{
		"id":        JsonString,
		"name":      JsonString,
		"email":     JsonString,
		"phone":     JsonString,
		"createdAt": JsonDate,
	},
}

var ProfileJsonModel = DashboardIndexableJsonModel{
	ModelName: models.PROFILE_MODEL_NAME,
	Fields: map[string]JsonFieldType{
		"id":        JsonNumber,
		"createdAt": JsonDate,
	},
}

var KpiJsonModel = DashboardIndexableJsonModel{
	ModelName: models.KPI_MODEL_NAME,
	Fields: map[string]JsonFieldType{
		"id":        JsonNumber,
		"createdBy": JsonCreatedBy,
		"updatedBy": JsonCreatedBy,
		"createdAt": JsonDate,
	},
}

var WidgetJsonModel = DashboardIndexableJsonModel{
	ModelName: models.WIDGET_MODEL_NAME,
	Fields: map[string]JsonFieldType{
		"id":        JsonNumber,
		"createdBy": JsonCreatedBy,
		"updatedBy": JsonCreatedBy,
		"createdAt": JsonDate,
		"dashboard": JsonString,
		"model":     JsonString,
	},
}

var DashboardJsonModel = DashboardIndexableJsonModel{
	ModelName: models.WIDGET_MODEL_NAME,
	Fields: map[string]JsonFieldType{
		"id":        JsonNumber,
		"createdBy": JsonCreatedBy,
		"updatedBy": JsonCreatedBy,
		"createdAt": JsonDate,
	},
}

var FormJsonModel = DashboardIndexableJsonModel{
	ModelName: models.FORM_MODEL_NAME,
	Fields: map[string]JsonFieldType{
		"id":                     JsonNumber,
		"active":                 JsonBool,
		"allowAnonymousResponse": JsonBool,
		"allowResponseUpdate":    JsonBool,
		"allowMultipleResponse":  JsonBool,
		"createdBy":              JsonCreatedBy,
		"updatedBy":              JsonCreatedBy,
		"createdAt":              JsonDate,
	},
}

var FormResponseJsonModel = DashboardIndexableJsonModel{
	ModelName: models.FORM_RESPONSE_MODEL_NAME,
	Fields: map[string]JsonFieldType{
		"id":        JsonNumber,
		"formId":    JsonNumber,
		"createdBy": JsonCreatedBy,
		"createdAt": JsonDate,
	},
}

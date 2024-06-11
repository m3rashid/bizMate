package models

type DashboardIndexableJsonModel struct {
	Fields    map[string]JsonFieldType `json:"fields"`
	ModelName string                   `json:"modelName"`
}

var UserJsonModel = DashboardIndexableJsonModel{
	ModelName: USER_MODEL_NAME,
	Fields: map[string]JsonFieldType{
		"id":          JsonString,
		"name":        JsonString,
		"email":       JsonString,
		"phone":       JsonString,
		"createdAt":   JsonDate,
		"deactivated": JsonBool,
	},
}

var ProfileJsonModel = DashboardIndexableJsonModel{
	ModelName: PROFILE_MODEL_NAME,
	Fields: map[string]JsonFieldType{
		"id":        JsonNumber,
		"createdAt": JsonDate,
	},
}

var KpiJsonModel = DashboardIndexableJsonModel{
	ModelName: KPI_MODEL_NAME,
	Fields: map[string]JsonFieldType{
		"id":        JsonNumber,
		"createdBy": JsonCreatedBy,
		"updatedBy": JsonCreatedBy,
		"createdAt": JsonDate,
	},
}

var WidgetJsonModel = DashboardIndexableJsonModel{
	ModelName: WIDGET_MODEL_NAME,
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
	ModelName: WIDGET_MODEL_NAME,
	Fields: map[string]JsonFieldType{
		"id":        JsonNumber,
		"createdBy": JsonCreatedBy,
		"updatedBy": JsonCreatedBy,
		"createdAt": JsonDate,
	},
}

var FormJsonModel = DashboardIndexableJsonModel{
	ModelName: FORM_MODEL_NAME,
	Fields: map[string]JsonFieldType{
		"id":                     JsonNumber,
		"title":                  JsonString,
		"description":            JsonString,
		"active":                 JsonBool,
		"sendResponseEmail":      JsonBool,
		"allowAnonymousResponse": JsonBool,
		"allowResponseUpdate":    JsonBool,
		"allowMultipleResponse":  JsonBool,
		"createdAt":              JsonDate,
		// "createdBy":              JsonCreatedBy,
		// "updatedBy":              JsonCreatedBy,
	},
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

package dashboard

import "bizmate/models"

type DashboardIndexableJsonModel struct {
	Fields    map[string]models.JsonFieldType `json:"fields"`
	ModelName string                          `json:"modelName"`
}

var UserJsonModel = DashboardIndexableJsonModel{
	ModelName: models.USER_MODEL_NAME,
	Fields: map[string]models.JsonFieldType{
		"id":        models.JsonString,
		"name":      models.JsonString,
		"email":     models.JsonString,
		"phone":     models.JsonString,
		"createdAt": models.JsonDate,
	},
}

var ProfileJsonModel = DashboardIndexableJsonModel{
	ModelName: models.PROFILE_MODEL_NAME,
	Fields: map[string]models.JsonFieldType{
		"id":        models.JsonNumber,
		"createdAt": models.JsonDate,
	},
}

var KpiJsonModel = DashboardIndexableJsonModel{
	ModelName: models.KPI_MODEL_NAME,
	Fields: map[string]models.JsonFieldType{
		"id":        models.JsonNumber,
		"createdBy": models.JsonCreatedBy,
		"updatedBy": models.JsonCreatedBy,
		"createdAt": models.JsonDate,
	},
}

var WidgetJsonModel = DashboardIndexableJsonModel{
	ModelName: models.WIDGET_MODEL_NAME,
	Fields: map[string]models.JsonFieldType{
		"id":        models.JsonNumber,
		"createdBy": models.JsonCreatedBy,
		"updatedBy": models.JsonCreatedBy,
		"createdAt": models.JsonDate,
		"dashboard": models.JsonString,
		"model":     models.JsonString,
	},
}

var DashboardJsonModel = DashboardIndexableJsonModel{
	ModelName: models.WIDGET_MODEL_NAME,
	Fields: map[string]models.JsonFieldType{
		"id":        models.JsonNumber,
		"createdBy": models.JsonCreatedBy,
		"updatedBy": models.JsonCreatedBy,
		"createdAt": models.JsonDate,
	},
}

var FormJsonModel = DashboardIndexableJsonModel{
	ModelName: models.FORM_MODEL_NAME,
	Fields: map[string]models.JsonFieldType{
		"id":                     models.JsonNumber,
		"active":                 models.JsonBool,
		"allowAnonymousResponse": models.JsonBool,
		"allowResponseUpdate":    models.JsonBool,
		"allowMultipleResponse":  models.JsonBool,
		"createdBy":              models.JsonCreatedBy,
		"updatedBy":              models.JsonCreatedBy,
		"createdAt":              models.JsonDate,
	},
}

var FormResponseJsonModel = DashboardIndexableJsonModel{
	ModelName: models.FORM_RESPONSE_MODEL_NAME,
	Fields: map[string]models.JsonFieldType{
		"id":        models.JsonNumber,
		"formId":    models.JsonNumber,
		"createdBy": models.JsonCreatedBy,
		"createdAt": models.JsonDate,
	},
}

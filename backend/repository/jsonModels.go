package repository

type JsonFieldType string

const (
	jsonString      JsonFieldType = "string"
	jsonNumber      JsonFieldType = "number"
	jsonBool        JsonFieldType = "boolean"
	jsonObject      JsonFieldType = "object"
	jsonArray       JsonFieldType = "array"
	jsonNull        JsonFieldType = "null"
	jsonDate        JsonFieldType = "date"
	jsonCreatedById JsonFieldType = "createdBy"
)

type DashboardIndexableJsonModel struct {
	Fields    map[string]JsonFieldType `json:"fields"`
	ModelName string                   `json:"modelName"`
}

var UserJsonModel = DashboardIndexableJsonModel{
	ModelName: USERS_MODEL_NAME,
	Fields: map[string]JsonFieldType{
		"id":          jsonString,
		"created_at":  jsonDate,
		"name":        jsonString,
		"email":       jsonString,
		"phone":       jsonString,
		"deactivated": jsonBool,
		"provider":    jsonString,
	},
}

var WorkspacesJsonModel = DashboardIndexableJsonModel{
	ModelName: WORKSPACES_MODEL_NAME,
	Fields: map[string]JsonFieldType{
		"id":            jsonString,
		"created_at":    jsonDate,
		"name":          jsonString,
		"description":   jsonBool,
		"created_by_id": jsonCreatedById,
	},
}

var usersWorkspacesRelation = DashboardIndexableJsonModel{
	ModelName: USERS_WORKSPACE_RELATION_MODEL_NAME,
	Fields: map[string]JsonFieldType{
		"user_id":      jsonString,
		"workspace_id": jsonString,
	},
}

var UserInviteJsonModel = DashboardIndexableJsonModel{
	ModelName: USER_INVITES_MODEL_NAME,
	Fields: map[string]JsonFieldType{
		"id":           jsonString,
		"created_at":   jsonDate,
		"worksoace_id": jsonString,
		"name":         jsonString,
		"email":        jsonString,
		"status":       jsonNumber,
	},
}

var FormResponseJsonModel = DashboardIndexableJsonModel{
	ModelName: FORM_RESPONSES_MODEL_NAME,
	Fields: map[string]JsonFieldType{
		"id":            jsonString,
		"created_at":    jsonDate,
		"workspace_id":  jsonString,
		"created_by_id": jsonCreatedById,
		"form_id":       jsonString,
		"device_ip":     jsonString,
		"response":      jsonObject,
	},
}

var FormJsonModel = DashboardIndexableJsonModel{
	ModelName: FORMS_MODEL_NAME,
	Fields: map[string]JsonFieldType{
		"id":                       jsonString,
		"created_at":               jsonDate,
		"workspace_id":             jsonString,
		"created_by_id":            jsonCreatedById,
		"title":                    jsonString,
		"description":              jsonString,
		"form_body_id":             jsonString,
		"next_text":                jsonString,
		"previous_text":            jsonString,
		"active":                   jsonBool,
		"send_response_email":      jsonBool,
		"allow_anonymous_response": jsonBool,
		"allow_multiple_response":  jsonBool,
	},
}

var FormBodyJsonModel = DashboardIndexableJsonModel{
	ModelName: FORM_BODY_COLLECTION_NAME,
	Fields: map[string]JsonFieldType{
		"form_id":         jsonString,
		"created_at":      jsonString,
		"workspace_id":    jsonString,
		"created_by_id":   jsonString,
		"form_inner_body": jsonArray,
	},
}

var FormInnerBodyFieldsJson = map[string]JsonFieldType{
	"created_at":    jsonString,
	"created_by_id": jsonString,
	"next_text":     jsonString,
	"previous_text": jsonString,
	"meta":          jsonArray,
}

var dashboardIndexableJsonModels = []DashboardIndexableJsonModel{
	UserJsonModel,
	WorkspacesJsonModel,
	usersWorkspacesRelation,
	UserInviteJsonModel,

	FormResponseJsonModel,
	FormJsonModel,
}

type jsonModels map[string]map[string]JsonFieldType

func getModels(modelsJson []DashboardIndexableJsonModel) jsonModels {
	dashboardModels := make(jsonModels)
	for _, jsonModel := range modelsJson {
		dashboardModels[jsonModel.ModelName] = jsonModel.Fields
	}
	return dashboardModels
}

func getModelNames(modelsJson []DashboardIndexableJsonModel) []string {
	var modelNames []string
	for _, jsonModel := range modelsJson {
		modelNames = append(modelNames, jsonModel.ModelName)
	}
	return modelNames
}

var DashboardIndexableJsonModels = getModels(dashboardIndexableJsonModels)
var DashboardIndexableModelNames = getModelNames(dashboardIndexableJsonModels)

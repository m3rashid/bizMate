package models

var dashboardIndexableJsonModels = []DashboardIndexableJsonModel{
	UserJsonModel,
	UserInviteJsonModel,

	ContactJsonModel,

	DashboardKpiJsonModel,
	DashboardChartJsonModel,
	DashboardJsonModel,

	EmailTemplateJsonModel,
	BulkEmailRequestJsonModel,

	TableExportLogJsonModel,

	FormJsonModel,
	FormResponseJsonModel,

	EmployeeJsonModel,
	AttendanceJsonModel,

	ProjectCycleJsonModel,
	ProjectJsonModel,
	ProjectTagJsonModel,
	ProjectTaskJsonModel,
	ProjectTaskEventJsonModel,
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

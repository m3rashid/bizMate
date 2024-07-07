package models

const DASHBOARD_MODEL_NAME string = "dashboards"
const DASHBOARD_KPI_MODEL_NAME string = "dashboard_kpis"
const DASHBOARD_CHART_MODEL_NAME string = "dashboard_charts"

var DashboardKpiJsonModel = DashboardIndexableJsonModel{
	ModelName: DASHBOARD_KPI_MODEL_NAME,
	Fields: map[string]JsonFieldType{
		"id":              JsonNumber,
		"dashboardId":     JsonNumber,
		"aggregationType": JsonString,
		"model":           JsonString,
		"createdBy":       JsonCreatedBy,
		"updatedBy":       JsonCreatedBy,
		"createdAt":       JsonDate,
	},
}

var DashboardChartJsonModel = DashboardIndexableJsonModel{
	ModelName: DASHBOARD_CHART_MODEL_NAME,
	Fields: map[string]JsonFieldType{
		"id":          JsonString,
		"dashboardId": JsonNumber,
		"createdBy":   JsonCreatedBy,
		"updatedBy":   JsonCreatedBy,
		"createdAt":   JsonDate,
		"model":       JsonString,
	},
}

var DashboardJsonModel = DashboardIndexableJsonModel{
	ModelName: DASHBOARD_MODEL_NAME,
	Fields: map[string]JsonFieldType{
		"id":          JsonString,
		"title":       JsonString,
		"description": JsonString,
		"active":      JsonBool,
		"createdBy":   JsonCreatedBy,
		"updatedBy":   JsonCreatedBy,
		"createdAt":   JsonDate,
	},
}

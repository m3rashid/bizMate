package models

const DASHBOARD_MODEL_NAME string = "dashboards"
const DASHBOARD_KPI_MODEL_NAME string = "dashboard_kpis"
const DASHBOARD_CHART_MODEL_NAME string = "dashboard_charts"

type KpiAggregationType string

const (
	KpiAggregationTypeSum     KpiAggregationType = "sum"
	KpiAggregationTypeCount   KpiAggregationType = "count"
	KpiAggregationTypeMax     KpiAggregationType = "max"
	KpiAggregationTypeMin     KpiAggregationType = "min"
	KpiAggregationTypeAverage KpiAggregationType = "avg"
	KpiAggregationTypeMedian  KpiAggregationType = "median"
	KpiAggregationTypeMode    KpiAggregationType = "mode"
)

var kpiAggregationTypes = []KpiAggregationType{
	KpiAggregationTypeSum,
	KpiAggregationTypeCount,
	KpiAggregationTypeMax,
	KpiAggregationTypeMin,
	KpiAggregationTypeAverage,
	KpiAggregationTypeMedian,
	KpiAggregationTypeMode,
}

func GetKpiAggregationTypes() []KpiAggregationType {
	return kpiAggregationTypes
}

// KPIs can be used to display key performance indicators on any page
type DashboardKpi struct {
	BaseModel
	CreatedBy
	UpdatedBy
	DashboardID     uint               `json:"dashboardId" gorm:"column:dashboardId;not null" validate:"required"`
	Dashboard       *Dashboard         `json:"dashboard" gorm:"foreignKey:dashboardId;constraint:OnUpdate:CASCADE,OnDelete:CASCADE;"`
	Title           string             `json:"title" gorm:"column:title;not null" validate:"required"`
	Description     string             `json:"description" gorm:"column:description;not null"`
	Model           string             `json:"model" gorm:"column:model;not null" validate:"required"`           // model name of the kpi
	ModelField      string             `json:"modelField" gorm:"column:modelField;not null" validate:"required"` // field name of the model to aggregate
	AggregationType KpiAggregationType `json:"aggregationType" gorm:"column:aggregationType;not null" validate:"required"`
	TimePeriod      int                `json:"timePeriod" gorm:"column:timePeriod;not null" validate:"required"` // in days
}

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

type ChartType string

type DashboardChart struct {
	BaseModel
	CreatedBy
	UpdatedBy
	DashboardID     uint       `json:"dashboardId" gorm:"column:dashboardId;not null" validate:"required"`
	Dashboard       *Dashboard `json:"dashboard" gorm:"foreignKey:dashboardId;constraint:OnUpdate:CASCADE,OnDelete:CASCADE;"`
	Title           string     `json:"title" gorm:"column:title;not null" validate:"required"`
	Description     string     `json:"description" gorm:"column:description;not null"`
	RefreshInterval int        `json:"refreshInterval" gorm:"column:refreshInterval;not null" validate:"required"`
	Position        int        `json:"position" gorm:"column:position;not null" validate:"required"` // index of the chart in the dashboard
	Model           string     `json:"model" gorm:"column:model;not null" validate:"required"`       // model name of the chart
	XLabel          string     `json:"xLabel" gorm:"column:xLabel"`
	YLabel          string     `json:"yLabel" gorm:"column:yLabel"`
	XDataKey        string     `json:"xDataKey" gorm:"column:xDataKey"` // field name of the x-axis data
	YDataKey        string     `json:"yDataKey" gorm:"column:yDataKey"` // field name of the y-axis data
	ChartType       ChartType  `json:"chartType" gorm:"column:chartType"`
	ChartOptions    string     `json:"chartOptions" gorm:"column:chartOptions"`
}

var DashboardChartJsonModel = DashboardIndexableJsonModel{
	ModelName: DASHBOARD_CHART_MODEL_NAME,
	Fields: map[string]JsonFieldType{
		"id":          JsonNumber,
		"dashboardId": JsonNumber,
		"createdBy":   JsonCreatedBy,
		"updatedBy":   JsonCreatedBy,
		"createdAt":   JsonDate,
		"model":       JsonString,
	},
}

type Dashboard struct {
	BaseModel
	CreatedBy
	UpdatedBy
	Title       string `json:"title" gorm:"column:title;not null" validate:"required"`
	Description string `json:"description" gorm:"column:description;not null"`
	Active      bool   `json:"active" gorm:"column:active;default:false"`
}

var DashboardJsonModel = DashboardIndexableJsonModel{
	ModelName: DASHBOARD_MODEL_NAME,
	Fields: map[string]JsonFieldType{
		"id":          JsonNumber,
		"title":       JsonString,
		"description": JsonString,
		"active":      JsonBool,
		"createdBy":   JsonCreatedBy,
		"updatedBy":   JsonCreatedBy,
		"createdAt":   JsonDate,
	},
}

func (DashboardKpi) TableName() string {
	return DASHBOARD_KPI_MODEL_NAME
}

func (DashboardChart) TableName() string {
	return DASHBOARD_CHART_MODEL_NAME
}

func (Dashboard) TableName() string {
	return DASHBOARD_MODEL_NAME
}

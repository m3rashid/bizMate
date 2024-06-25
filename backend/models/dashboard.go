package models

const KPI_MODEL_NAME string = "kpis"
const WIDGET_MODEL_NAME string = "widgets"
const DASHBOARD_MODEL_NAME string = "dashboards"

type WidgetChartType string

// KPIs can be used to display key performance indicators on any page
type Kpi struct {
	BaseModel
	CreatedBy
	UpdatedBy
	Title           string `json:"title" gorm:"column:title;not null" validate:"required"`
	Description     string `json:"description" gorm:"column:description;not null"`
	Model           string `json:"model" gorm:"column:model;not null" validate:"required"` // model name of the kpi
	RefreshInterval int    `json:"refreshInterval" gorm:"column:refreshInterval;not null" validate:"required"`
	PageRoute       string `json:"pageRoute" gorm:"column:pageRoute;not null" validate:"required"`
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

type Widget struct {
	BaseModel
	CreatedBy
	UpdatedBy
	DashboardID     uint            `json:"dashboardId" gorm:"column:dashboardId;not null" validate:"required"`
	Dashboard       *Dashboard      `json:"dashboard" gorm:"foreignKey:dashboardId;constraint:OnUpdate:CASCADE,OnDelete:CASCADE;"`
	Title           string          `json:"title" gorm:"column:title;not null" validate:"required"`
	Description     string          `json:"description" gorm:"column:description;not null"`
	RefreshInterval int             `json:"refreshInterval" gorm:"column:refreshInterval;not null" validate:"required"`
	Position        int             `json:"position" gorm:"column:position;not null" validate:"required"` // index of the widget in the dashboard
	Model           string          `json:"model" gorm:"column:model;not null" validate:"required"`       // model name of the widget
	XLabel          string          `json:"xLabel" gorm:"column:xLabel"`
	YLabel          string          `json:"yLabel" gorm:"column:yLabel"`
	XDataKey        string          `json:"xDataKey" gorm:"column:xDataKey"` // field name of the x-axis data
	YDataKey        string          `json:"yDataKey" gorm:"column:yDataKey"` // field name of the y-axis data
	ChartType       WidgetChartType `json:"chartType" gorm:"column:chartType"`
	ChartOptions    string          `json:"chartOptions" gorm:"column:chartOptions"`
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

type Dashboard struct {
	BaseModel
	CreatedBy
	UpdatedBy
	Title       string `json:"title" gorm:"column:title;not null" validate:"required"`
	Description string `json:"description" gorm:"column:description;not null"`
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

func (Kpi) TableName() string {
	return KPI_MODEL_NAME
}

func (Widget) TableName() string {
	return WIDGET_MODEL_NAME
}

func (Dashboard) TableName() string {
	return DASHBOARD_MODEL_NAME
}

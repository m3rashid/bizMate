package models

const KPI_MODEL_NAME = "kpis"
const WIDGET_MODEL_NAME = "widgets"
const DASHBOARD_MODEL_NAME = "dashboards"

type ChartType string

// KPIs can be used to display key performance indicators on any page
type Kpi struct {
	BaseModel
	CreatedBy
	UpdatedBy
	Title           string `json:"title" gorm:"column:title;not null" validate:"required"`
	Description     string `json:"description" gorm:"column:description;not null" validate:""`
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
	DashboardID     uint       `json:"dashboardId" gorm:"column:dashboardId;not null" validate:"required"`
	Dashboard       *Dashboard `json:"form" gorm:"foreignKey:dashboardId;constraint:OnUpdate:CASCADE,OnDelete:CASCADE;" validate:""`
	Title           string     `json:"title" gorm:"column:title;not null" validate:"required"`
	Description     string     `json:"description" gorm:"column:description;not null" validate:""`
	RefreshInterval int        `json:"refreshInterval" gorm:"column:refreshInterval;not null" validate:"required"`
	Position        int        `json:"position" gorm:"column:position;not null" validate:"required"` // index of the widget in the dashboard
	Model           string     `json:"model" gorm:"column:model;not null" validate:"required"`       // model name of the widget
	XLabel          string     `json:"xLabel,omitempty" gorm:"column:xLabel" validate:""`
	YLabel          string     `json:"yLabel,omitempty" gorm:"column:yLabel" validate:""`
	XDataKey        string     `json:"xDataKey,omitempty" gorm:"column:xDataKey" validate:""` // field name of the x-axis data
	YDataKey        string     `json:"yDataKey,omitempty" gorm:"column:yDataKey" validate:""` // field name of the y-axis data
	ChartType       ChartType  `json:"chartType,omitempty" gorm:"column:chartType" validate:""`
	ChartOptions    string     `json:"chartOptions,omitempty" gorm:"column:chartOptions" validate:""`
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
	Description string `json:"description" gorm:"column:description;not null" validate:""`
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

func (*Kpi) TableName() string {
	return KPI_MODEL_NAME
}

func (*Widget) TableName() string {
	return WIDGET_MODEL_NAME
}

func (*Dashboard) TableName() string {
	return DASHBOARD_MODEL_NAME
}

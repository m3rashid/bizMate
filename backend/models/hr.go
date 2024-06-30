package models

import "time"

const EMPLOYEE_MODEL_NAME string = "employees"
const ATTENDANCE_MODEL_NAME string = "attendance"

type EmployementType uint

const (
	FullTime   EmployementType = 32
	PartTime   EmployementType = 16
	Contract   EmployementType = 8
	Consultant EmployementType = 4
	Intern     EmployementType = 2
	FreeLancer EmployementType = 1
)

type Employee struct {
	BaseModelWithWorkspace
	CreatedBy
	UpdatedBy
	UserID          uint            `json:"userId" gorm:"column:userId;not null" validate:"required"`
	User            *User           `json:"user" gorm:"column:userId;constraint:OnUpdate:CASCADE,OnDelete:CASCADE;"`
	EmployementType EmployementType `json:"employementType" gorm:"column:employementType;not null" validate:"required"`
	MonthlySalary   float64         `json:"monthlySalary" gorm:"column:monthlySalary;not null" validate:"required"`
	WeeklyHours     float64         `json:"weeklyHours" gorm:"column:weeklyHours;not null" validate:"required"`
}

var EmployeeJsonModel = DashboardIndexableJsonModel{
	ModelName: EMPLOYEE_MODEL_NAME,
	Fields: map[string]JsonFieldType{
		"id":              JsonNumber,
		"userId":          JsonNumber,
		"createdBy":       JsonCreatedBy,
		"updatedBy":       JsonCreatedBy,
		"createdAt":       JsonDate,
		"weeklyHours":     JsonNumber,
		"monthlySalary":   JsonNumber,
		"employementType": JsonNumber,
	},
}

type Attendance struct {
	BaseModelWithWorkspace
	CreatedBy
	EmployeeID uint      `json:"employeeId" gorm:"column:employeeId;not null" validate:"required"`
	Employee   *Employee `json:"employee" gorm:"foreignKey:employeeId;constraint:OnUpdate:CASCADE,OnDelete:CASCADE;"`
	StartTime  time.Time `json:"startTime" gorm:"column:startTime;not null" validate:"required"`
	EndTime    time.Time `json:"endTime" gorm:"column:endTime" validate:""`
}

var AttendanceJsonModel = DashboardIndexableJsonModel{
	ModelName: ATTENDANCE_MODEL_NAME,
	Fields: map[string]JsonFieldType{
		"id":         JsonNumber,
		"endTime":    JsonDate,
		"startTime":  JsonDate,
		"createdAt":  JsonDate,
		"createdBy":  JsonCreatedBy,
		"employeeId": JsonNumber,
	},
}

func (Employee) TableName() string {
	return EMPLOYEE_MODEL_NAME
}

func (Attendance) TableName() string {
	return ATTENDANCE_MODEL_NAME
}

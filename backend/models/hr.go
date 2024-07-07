package models

const EMPLOYEE_MODEL_NAME string = "employees"
const ATTENDANCE_MODEL_NAME string = "attendance"

type EmployementType int

const (
	FullTime   EmployementType = 32
	PartTime   EmployementType = 16
	Contract   EmployementType = 8
	Consultant EmployementType = 4
	Intern     EmployementType = 2
	FreeLancer EmployementType = 1
)

var EmployeeJsonModel = DashboardIndexableJsonModel{
	ModelName: EMPLOYEE_MODEL_NAME,
	Fields: map[string]JsonFieldType{
		"id":              JsonString,
		"userId":          JsonString,
		"createdBy":       JsonCreatedBy,
		"updatedBy":       JsonCreatedBy,
		"createdAt":       JsonDate,
		"weeklyHours":     JsonNumber,
		"monthlySalary":   JsonNumber,
		"employementType": JsonNumber,
	},
}

var AttendanceJsonModel = DashboardIndexableJsonModel{
	ModelName: ATTENDANCE_MODEL_NAME,
	Fields: map[string]JsonFieldType{
		"id":         JsonString,
		"endTime":    JsonDate,
		"startTime":  JsonDate,
		"createdAt":  JsonDate,
		"createdBy":  JsonCreatedBy,
		"employeeId": JsonString,
	},
}

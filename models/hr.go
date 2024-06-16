package models

const CLOCKIN_MODEL_NAME string = "clockins"
const EMPLOYEE_MODEL_NAME string = "employees"

type EmployementType uint

const (
	FullTime   EmployementType = 6
	PartTime   EmployementType = 5
	Contract   EmployementType = 4
	Consultant EmployementType = 3
	Intern     EmployementType = 2
	FreeLancer EmployementType = 1
)

type Employee struct {
	BaseModel
	CreatedBy
	UpdatedBy
	UserID          uint            `json:"userId" gorm:"column:userId;not null" validate:"required"`
	User            *User           `json:"user" gorm:"column:userId;constraint:OnUpdate:CASCADE,OnDelete:CASCADE;"`
	EmployementType EmployementType `json:"employementType" gorm:"column:employementType;not null" validate:"required"`
	MonthlySalary   float64         `json:"monthlySalary" gorm:"column:monthlySalary;not null" validate:"required"`
	WeeklyHours     float64         `json:"weeklyHours" gorm:"column:weeklyHours;not null" validate:"required"`
}

type ClockIn struct {
	BaseModel
	CreatedBy
	StartTime string `json:"startTime" gorm:"column:startTime;not null" validate:"required"`
	EndTime   string `json:"endTime" gorm:"column:endTime;not null" validate:"required"`
}

func (Employee) TableName() string {
	return EMPLOYEE_MODEL_NAME
}

func (ClockIn) TableName() string {
	return CLOCKIN_MODEL_NAME
}

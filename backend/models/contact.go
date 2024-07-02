package models

import "time"

const CONTACT_MODEL_NAME string = "contacts"

type Contact struct {
	BaseModelWithWorkspace
	CreatedBy
	UpdatedBy
	Name         string    `json:"name" gorm:"column:name;not null" validate:"required"`
	Email        string    `json:"email" gorm:"column:email;not null" validate:"required,email"`
	Phone        string    `json:"phone" gorm:"column:phone"`
	Birthday     time.Time `json:"birthday" gorm:"column:birthday"`
	OtherPhones  string    `json:"otherPhones" gorm:"column:otherPhones"`   // array of string
	OtherEmails  string    `json:"otherEmails" gorm:"column:otherEmails"`   // array of string
	OtherDetails string    `json:"otherDetails" gorm:"column:otherDetails"` // stringified json
}

var ContactJsonModel = DashboardIndexableJsonModel{
	ModelName: CONTACT_MODEL_NAME,
	Fields: map[string]JsonFieldType{
		"id":        JsonString,
		"name":      JsonString,
		"email":     JsonString,
		"phone":     JsonString,
		"birthday":  JsonDate,
		"createdAt": JsonDate,
		"createdBy": JsonCreatedBy,
	},
}

func (Contact) TableName() string {
	return CONTACT_MODEL_NAME
}

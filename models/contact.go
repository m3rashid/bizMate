package models

import "time"

const CONTACT_MODEL_NAME string = "contacts"

type Contact struct {
	BaseModel
	CreatedBy
	UpdatedBy
	Name         string    `json:"name" gorm:"column:name;not null" validate:"required"`
	Email        string    `json:"email" gorm:"column:email;unique;not null" validate:"required,email"`
	Phone        string    `json:"phone" gorm:"column:phone"`
	Birthday     time.Time `json:"birthday" gorm:"column:birthday"`
	OtherPhones  string    `json:"otherPhones" gorm:"column:otherPhones"`   // array of string
	OtherEmails  string    `json:"otherEmails" gorm:"column:otherEmails"`   // array of string
	OtherDetails string    `json:"otherDetails" gorm:"column:otherDetails"` // stringified json
}

func (Contact) TableName() string {
	return CONTACT_MODEL_NAME
}

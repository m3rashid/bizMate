package models

const CONTACT_MODEL_NAME = "contacts"

type Contact struct {
	BaseModel
}

func (*Contact) TableName() string {
	return CONTACT_MODEL_NAME
}

package models

const CONTACT_MODEL_NAME string = "contacts"

type Contact struct {
	BaseModel
	CreatedBy
	UpdatedBy
}

func (Contact) TableName() string {
	return CONTACT_MODEL_NAME
}

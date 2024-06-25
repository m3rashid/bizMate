package models

import (
	"bizMate/utils"

	"gorm.io/gorm"
)

const TENANT_MODEL_NAME string = "tenants"

type Tenant struct {
	BaseModel
	Name     string `gorm:"column:name" json:"name" validate:"required"`
	UniqueID string `gorm:"column:uniqueId" json:"uniqueId" validate:"required"`
}

func (Tenant) TableName() string {
	return TENANT_MODEL_NAME
}

func (tenant *Tenant) BeforeCreate(tx *gorm.DB) error {
	tenant.UniqueID = utils.GenerateUuid()
	return nil
}

package models

import "time"

const TENANT_MODEL_NAME = "tenants"
const TENANT_OWNER_MODEL_NAME = "tenant_owners"

type Tenant struct {
	ID                       uint         `gorm:"primary_key;column:id" json:"id"`
	Name                     string       `gorm:"column:name;not null;unique" json:"name" validate:"required"`
	TenantUrl                string       `gorm:"column:tenantUrl;not null" json:"tenantUrl" validate:"required"`
	CreatedAt                time.Time    `gorm:"column:createdAt; default:current_timestamp" json:"createdAt"`
	TenantDBConnectionString string       `gorm:"column:tenantDBConnectionString;not null;unique" json:"tenantDBConnectionString" validate:""`
	TenantOwnerID            uint         `json:"tenantOwnerId" gorm:"column:tenantOwnerId;not null" validate:"required"`
	TenantOwner              *TenantOwner `json:"tenantOwner" gorm:"column:tenantOwnerId;constraint:OnUpdate:CASCADE,OnDelete:CASCADE;" validate:""`
}

type TenantOwner struct {
	ID        uint      `gorm:"primary_key;column:id" json:"id"`
	Name      string    `gorm:"column:name;not null" json:"name" validate:"required"`
	Email     string    `gorm:"column:email;not null" json:"email" validate:"required"`
	Password  string    `gorm:"column:password;not null" json:"password" validate:"required"`
	CreatedAt time.Time `gorm:"column:createdAt; default:current_timestamp" json:"createdAt"`
}

func (*Tenant) TableName() string {
	return TENANT_MODEL_NAME
}

func (*TenantOwner) TableName() string {
	return TENANT_OWNER_MODEL_NAME
}

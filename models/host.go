package models

import "time"

const TENANT_MODEL_NAME string = "tenants"
const TENANT_OWNER_MODEL_NAME string = "tenant_owners"

type Tenant struct {
	ID            uint         `gorm:"primary_key;column:id" json:"id"`
	Name          string       `gorm:"column:name;not null;unique" json:"name" validate:"required"`
	TenantUrl     string       `gorm:"column:tenantUrl;not null;unique" json:"tenantUrl" validate:"required"`
	CreatedAt     time.Time    `gorm:"column:createdAt; default:current_timestamp" json:"createdAt"`
	DbUri         string       `gorm:"column:dbUri;not null;unique" json:"dbUri"`
	TenantOwnerID uint         `json:"tenantOwnerId" gorm:"column:tenantOwnerId;not null" validate:"required"`
	TenantOwner   *TenantOwner `json:"tenantOwner" gorm:"column:tenantOwnerId;constraint:OnUpdate:CASCADE,OnDelete:CASCADE;"`
}

type TenantOwner struct {
	ID        uint      `gorm:"primary_key;column:id" json:"id"`
	Name      string    `gorm:"column:name;not null" json:"name" validate:"required"`
	Email     string    `gorm:"column:email;not null" json:"email" validate:"required"`
	Password  string    `gorm:"column:password;not null" json:"password" validate:"required"`
	CreatedAt time.Time `gorm:"column:createdAt; default:current_timestamp" json:"createdAt"`
}

func (Tenant) TableName() string {
	return TENANT_MODEL_NAME
}

func (TenantOwner) TableName() string {
	return TENANT_OWNER_MODEL_NAME
}

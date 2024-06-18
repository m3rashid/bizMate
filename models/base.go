package models

import (
	"time"
)

type BaseModel struct {
	ID        uint      `gorm:"primary_key;column:id" json:"id"`
	Deleted   bool      `gorm:"column:deleted;default:false" json:",omitempty"`
	CreatedAt time.Time `gorm:"column:createdAt; default:current_timestamp" json:"createdAt"`
	// TenantID  uint      `gorm:"column:tenantId" json:"tenantId" validate:"required"`
}

type CreatedBy struct {
	CreatedByID   uint  `json:"createdById" gorm:"column:createdById;not null" validate:"required"`
	CreatedByUser *User `json:"createdByUser" gorm:"foreignKey:createdById;constraint:OnUpdate:CASCADE,OnDelete:CASCADE;"`
}

type OptionalCreatedBy struct {
	CreatedByID   *uint `json:"createdById,omitempty" gorm:"column:createdById"`
	CreatedByUser *User `json:"createdByUser,omitempty" gorm:"foreignKey:createdById;constraint:OnUpdate:CASCADE,OnDelete:CASCADE;"`
}

type UpdatedBy struct {
	UpdatedByID   *uint `json:"updatedById,omitempty" gorm:"column:updatedById"`
	UpdatedByUser *User `json:"updatedByUser" gorm:"foreignKey:updatedById;constraint:OnUpdate:CASCADE,OnDelete:CASCADE;"`
}

type JsonFieldType string

const (
	JsonString    JsonFieldType = "string"
	JsonNumber    JsonFieldType = "number"
	JsonBool      JsonFieldType = "boolean"
	JsonObject    JsonFieldType = "object"
	JsonArray     JsonFieldType = "array"
	JsonNull      JsonFieldType = "null"
	JsonDate      JsonFieldType = "date"
	JsonCreatedBy JsonFieldType = "createdBy"
)

type DashboardIndexableJsonModel struct {
	Fields    map[string]JsonFieldType `json:"fields"`
	ModelName string                   `json:"modelName"`
}

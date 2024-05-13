package models

import (
	"time"
)

type BaseModel struct {
	ID        uint      `gorm:"primary_key;column:id" json:"id"`
	Deleted   bool      `gorm:"column:deleted;default:false" json:",omitempty" validate:""`
	CreatedAt time.Time `gorm:"column:createdAt; default:current_timestamp" json:"createdAt"`
	// TenantID  uint      `gorm:"column:tenantId" json:"tenantId" validate:"required"`
}

type CreatedBy struct {
	CreatedByID   uint  `json:"createdById" gorm:"column:createdById;not null" validate:"required"`
	CreatedByUser *User `json:"createdByUser" gorm:"foreignKey:createdById;constraint:OnUpdate:CASCADE,OnDelete:CASCADE;" validate:""`
}

type OptionalCreatedBy struct {
	CreatedByID   *uint `json:"createdById,omitempty" gorm:"column:createdById" validate:""`
	CreatedByUser *User `json:"createdByUser,omitempty" gorm:"foreignKey:createdById;constraint:OnUpdate:CASCADE,OnDelete:CASCADE;" validate:""`
}

type UpdatedBy struct {
	UpdatedByID   *uint `json:"updatedById,omitempty" gorm:"column:updatedById" validate:""`
	UpdatedByUser *User `json:"updatedByUser" gorm:"foreignKey:updatedById;constraint:OnUpdate:CASCADE,OnDelete:CASCADE;" validate:""`
}

package models

import "time"

type BaseModel struct {
	ID        uint      `gorm:"primary_key;column:id" json:"id"`
	Deleted   bool      `gorm:"column:deleted;default:false" json:",omitempty" validate:""`
	CreatedAt time.Time `gorm:"column:createdAt; default:current_timestamp" json:"createdAt"`
	// TenantID  uint      `gorm:"column:tenantId" json:"tenantId" validate:"required"`
}

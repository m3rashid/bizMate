package models

import (
	"bizMate/utils"
	"time"

	"gorm.io/gorm"
)

type BaseModel struct {
	ID        string    `json:"id" gorm:"type:uuid;primary_key;column:id"`
	Deleted   bool      `json:"" gorm:"column:deleted;default:false"`
	CreatedAt time.Time `json:"createdAt" gorm:"column:createdAt; default:current_timestamp"`
}

func (b *BaseModel) BeforeCreate(tx *gorm.DB) error {
	id, err := utils.GenerateUuidV7()
	if err != nil {
		return err
	}

	b.ID = id
	return nil
}

type BaseModelWithWorkspace struct {
	ID          string    `json:"id" gorm:"type:uuid;primary_key;column:id"`
	Deleted     bool      `json:"" gorm:"column:deleted;default:false"`
	CreatedAt   time.Time `json:"createdAt" gorm:"column:createdAt; default:current_timestamp"`
	WorkspaceID string    `json:"workspaceId" gorm:"type:uuid;column:workspaceId" validate:"required"`
}

func (b *BaseModelWithWorkspace) BeforeCreate(tx *gorm.DB) error {
	id, err := utils.GenerateUuidV7()
	if err != nil {
		return err
	}

	b.ID = id
	return nil
}

type CreatedBy struct {
	CreatedByID   string `json:"createdById" gorm:"column:createdById;not null" validate:"required"`
	CreatedByUser *User  `json:"createdByUser" gorm:"foreignKey:createdById;constraint:OnUpdate:CASCADE,OnDelete:CASCADE;"`
}

type OptionalCreatedBy struct {
	CreatedByID   *string `json:"createdById" gorm:"column:createdById"`
	CreatedByUser *User   `json:"createdByUser" gorm:"foreignKey:createdById;constraint:OnUpdate:CASCADE,OnDelete:CASCADE;"`
}

type UpdatedBy struct {
	UpdatedByID   *string `json:"updatedById" gorm:"column:updatedById"`
	UpdatedByUser *User   `json:"updatedByUser" gorm:"foreignKey:updatedById;constraint:OnUpdate:CASCADE,OnDelete:CASCADE;"`
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

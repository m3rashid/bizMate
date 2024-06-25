package controllers

const SKIP_VALIDATION_KEY = "skipValidation"
const CREATED_AT_FIELD = "createdAt"
const UPDATED_AT_FIELD = "updatedAt"

type DbModel interface {
	TableName() string
}

// type ResourceIndex struct {
// 	Name         string `json:"name"`
// 	Description  string `json:"description"`
// 	ResourceType string `json:"resourceType"`
// }

// type CreateRequestBody[T interface{}] struct {
// 	Body          T             `json:"body" validate:"required"`
// 	ResourceIndex ResourceIndex `json:"resourceIndex"`
// }

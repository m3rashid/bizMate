package controllers

const SKIP_VALIDATION_KEY = "skipValidation"
const CREATED_AT_FIELD = "createdAt"
const UPDATED_AT_FIELD = "updatedAt"

type PaginationResponse[T interface{}] struct {
	Docs            []T   `json:"docs"`
	Count           int   `json:"count"`
	Limit           int   `json:"limit"`
	TotalDocs       int64 `json:"totalDocs"`
	CurrentPage     int   `json:"currentPage"`
	HasNextPage     bool  `json:"hasNextPage"`
	HasPreviousPage bool  `json:"hasPreviousPage"`
}

type ResourceIndex struct {
	Name         string `json:"name" validate:""`
	Description  string `json:"description" validate:""`
	ResourceType string `json:"resourceType" validate:""`
}

type CreateRequestBody[T interface{}] struct {
	Body          T             `json:"body" validate:"required"`
	ResourceIndex ResourceIndex `json:"resourceIndex" validate:""`
}

type DbModel interface {
	TableName() string
}

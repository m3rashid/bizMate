package utils

type PaginationResponse[T any] struct {
	Docs            []T  `json:"docs"`
	Limit           int  `json:"limit"`
	Count           int  `json:"count"`
	TotalDocs       int  `json:"totalDocs"`
	CurrentPage     int  `json:"page"`
	HasNextPage     bool `json:"hasNextPage"`
	HasPreviousPage bool `json:"hasPreviousPage"`
}

var DefaultPaginationResponse = PaginationResponse[interface{}]{
	Docs:            []interface{}{},
	Limit:           0,
	Count:           0,
	TotalDocs:       0,
	CurrentPage:     1,
	HasNextPage:     false,
	HasPreviousPage: false,
}

type PaginationRequestBody struct {
	Query string `json:"query" validate:"required"`
	Page  int    `json:"page" validate:"required"`
	Limit int    `json:"limit" validate:"required"`
}

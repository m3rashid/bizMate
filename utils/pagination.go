package utils

type PaginationResponse[T any] struct {
	Docs            []T   `json:"docs"`
	Limit           int   `json:"limit"`
	Count           int   `json:"count"`
	TotalDocs       int64 `json:"totalDocs"`
	CurrentPage     int   `json:"page"`
	HasNextPage     bool  `json:"hasNextPage"`
	HasPreviousPage bool  `json:"hasPreviousPage"`
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

type PaginationRequestQuery struct {
	Page  int `json:"page"`
	Limit int `json:"limit"`
}

package utils

import (
	"fmt"

	"github.com/gofiber/fiber/v2"
)

type PaginationRequestQuery struct {
	Page  int32 `query:"page"`
	Limit int32 `query:"limit"`
}

type PaginationResponse[T any] struct {
	Docs            []T   `json:"docs"`
	Limit           int32 `json:"limit"`
	Count           int   `json:"count"`
	TotalDocs       int64 `json:"totalDocs"`
	CurrentPage     int32 `json:"page"`
	HasNextPage     bool  `json:"hasNextPage"`
	HasPreviousPage bool  `json:"hasPreviousPage"`
}

func (pgRes *PaginationResponse[T]) ParseQuery(ctx *fiber.Ctx, maxLimit int32) error {
	reqQuery := PaginationRequestQuery{}
	if err := ctx.QueryParser(&reqQuery); err != nil {
		fmt.Println(err)
	}

	pageNo := Ternary(reqQuery.Page == 0, 1, reqQuery.Page)
	pageLimit := min(Ternary(reqQuery.Limit == 0, 10, reqQuery.Limit), maxLimit)

	pgRes.Limit = pageLimit
	pgRes.CurrentPage = pageNo
	return nil
}

func (pgRes *PaginationResponse[T]) BuildPaginationResponse() {
	pgRes.Count = len(pgRes.Docs)
	pgRes.HasNextPage = pgRes.TotalDocs > int64(pgRes.Limit)
	pgRes.HasPreviousPage = pgRes.CurrentPage > 1
	if pgRes.Docs == nil {
		pgRes.Docs = []T{}
	}
}

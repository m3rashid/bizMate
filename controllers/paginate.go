package controllers

import (
	"bizmate/utils"
	"fmt"
	"strings"

	"github.com/gofiber/fiber/v2"
)

type PaginateOptions struct {
	ParamKeys []string
	QueryKeys []string
	Populate  []string
}

func Paginate[Model interface{}](tableName string, _paginationOptions ...PaginateOptions) func(*fiber.Ctx) error {
	if len(_paginationOptions) > 1 {
		panic("Only one pagination option is allowed")
	}

	paginationOptions := PaginateOptions{}
	if len(_paginationOptions) > 0 {
		paginationOptions = _paginationOptions[0]
	}

	return func(ctx *fiber.Ctx) error {
		reqBody := utils.PaginationRequestQuery{}
		if err := ctx.QueryParser(&reqBody); err != nil {
			return ctx.Status(fiber.StatusBadRequest).JSON(fiber.Map{"error": "Bad Request"})
		}

		requestQueriesAndParams := []string{}
		for _, queryKey := range paginationOptions.QueryKeys {
			if queryValue := ctx.Query(queryKey); queryValue != "" {
				requestQueriesAndParams = append(requestQueriesAndParams, fmt.Sprintf("\"%s\" = %s", queryKey, queryValue))
			}
		}

		for _, paramKey := range paginationOptions.ParamKeys {
			if paramValue := ctx.Params(paramKey); paramValue != "" {
				requestQueriesAndParams = append(requestQueriesAndParams, fmt.Sprintf("\"%s\" = %s", paramKey, paramValue))
			}
		}

		requestQueryParams := strings.Join(requestQueriesAndParams, " AND ")

		if reqBody.Page <= 0 {
			reqBody.Page = 1
		}

		if reqBody.Limit <= 0 {
			reqBody.Limit = 10
		}

		reqBody.Limit = min(reqBody.Limit, 50)

		db, err := utils.GetTenantDbFromCtx(ctx)
		if err != nil {
			return ctx.Status(fiber.StatusInternalServerError).JSON(fiber.Map{"error": "Internal Server Error"})
		}

		if paginationOptions.Populate != nil {
			for _, populate := range paginationOptions.Populate {
				db = db.Preload(populate)
			}
		}

		results := []Model{}
		if err := db.Where(requestQueryParams).Order("id DESC").Limit(reqBody.Limit).Offset((reqBody.Page - 1) * reqBody.Limit).Find(&results).Error; err != nil {
			return ctx.Status(fiber.StatusInternalServerError).JSON(fiber.Map{"error": "Internal Server Error"})
		}

		var docsCount int64 = 0
		if err := db.Table(tableName).Where(requestQueryParams).Count(&docsCount).Error; err != nil {
			return ctx.Status(fiber.StatusInternalServerError).JSON(fiber.Map{"error": "Internal Server Error"})
		}

		paginationResponse := utils.PaginationResponse[Model]{
			Docs:            results,
			Limit:           reqBody.Limit,
			Count:           len(results),
			TotalDocs:       docsCount,
			CurrentPage:     reqBody.Page,
			HasNextPage:     docsCount > int64(reqBody.Page*reqBody.Limit),
			HasPreviousPage: reqBody.Page > 1,
		}

		return ctx.Status(fiber.StatusOK).JSON(paginationResponse)
	}
}

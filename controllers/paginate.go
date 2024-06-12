package controllers

import (
	"bizmate/utils"
	"fmt"
	"strings"

	"github.com/gofiber/fiber/v2"
)

type PaginateOptions struct {
	ParamKeys          []string
	QueryKeys          []string
	Populate           []string
	IncludeSoftDeleted bool // default false: dont include soft deleted
	ReturnOnlyDeleted  bool // to show deleted items
}

func Paginate[Model DbModel](_options ...PaginateOptions) func(*fiber.Ctx) error {
	var _mod Model
	tableName := _mod.TableName()

	if len(_options) > 1 {
		panic("Only one pagination option is allowed")
	}

	paginationOptions := PaginateOptions{}
	if len(_options) > 0 {
		paginationOptions = _options[0]
	}

	return func(ctx *fiber.Ctx) error {
		reqQuery := utils.PaginationRequestQuery{}
		if err := ctx.QueryParser(&reqQuery); err != nil {
			return ctx.Status(fiber.StatusBadRequest).JSON("Bad Request")
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

		if reqQuery.Page <= 0 {
			reqQuery.Page = 1
		}

		if reqQuery.Limit <= 0 {
			reqQuery.Limit = 10
		}

		reqQuery.Limit = min(reqQuery.Limit, 50)

		db, err := utils.GetTenantDbFromCtx(ctx)
		if err != nil {
			return ctx.SendStatus(fiber.StatusInternalServerError)
		}

		if paginationOptions.Populate != nil {
			for _, populate := range paginationOptions.Populate {
				db = db.Preload(populate)
			}
		}

		if !paginationOptions.IncludeSoftDeleted {
			db = db.Where("deleted = false")
		}

		if paginationOptions.ReturnOnlyDeleted {
			db = db.Where("deleted = true")
		}

		results := []Model{}
		if err := db.Where(requestQueryParams).Order("id DESC").Limit(reqQuery.Limit).Offset((reqQuery.Page - 1) * reqQuery.Limit).Find(&results).Error; err != nil {
			return ctx.SendStatus(fiber.StatusInternalServerError)
		}

		var docsCount int64 = 0
		if err := db.Table(tableName).Where(requestQueryParams).Count(&docsCount).Error; err != nil {
			return ctx.SendStatus(fiber.StatusInternalServerError)
		}

		paginationResponse := utils.PaginationResponse[Model]{
			Docs:            results,
			Limit:           reqQuery.Limit,
			Count:           len(results),
			TotalDocs:       docsCount,
			CurrentPage:     reqQuery.Page,
			HasNextPage:     docsCount > int64(reqQuery.Page*reqQuery.Limit),
			HasPreviousPage: reqQuery.Page > 1,
		}

		return ctx.Status(fiber.StatusOK).JSON(paginationResponse)
	}
}

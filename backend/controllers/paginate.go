package controllers

// import (
// 	"bizMate/utils"
// 	"fmt"
// 	"strings"

// 	"github.com/gofiber/fiber/v2"
// 	"github.com/google/uuid"
// )

// type PaginateOptions struct {
// 	ParamKeys          []string
// 	QueryKeys          []string
// 	Populate           []string
// 	IncludeSoftDeleted bool // default false: dont include soft deleted
// 	ReturnOnlyDeleted  bool // to show deleted items
// 	GetWorkspaceID     func(*fiber.Ctx) (uuid.UUID, error)
// }

// func Paginate[Model DbModel](_options ...PaginateOptions) func(*fiber.Ctx) error {
// 	var _mod Model
// 	tableName := _mod.TableName()

// 	if len(_options) > 1 {
// 		panic("Only one pagination option is allowed")
// 	}

// 	paginationOptions := PaginateOptions{}
// 	if len(_options) > 0 {
// 		paginationOptions = _options[0]
// 	}

// 	return func(ctx *fiber.Ctx) error {
// 		reqQuery := utils.PaginationRequestQuery{}
// 		if err := ctx.QueryParser(&reqQuery); err != nil {
// 			return ctx.Status(fiber.StatusBadRequest).JSON(utils.TranslateToLocalLanguage(ctx, "Bad Request"))
// 		}

// 		var workspaceId uuid.UUID
// 		if paginationOptions.GetWorkspaceID != nil {
// 			tId, err := paginationOptions.GetWorkspaceID(ctx)
// 			if err != nil {
// 				return ctx.SendStatus(fiber.StatusBadRequest)
// 			}
// 			workspaceId = tId
// 		} else {
// 			_, workspaceId = utils.GetUserAndWorkspaceIdsOrZero(ctx)
// 		}

// 		requestQueriesAndParams := []string{}
// 		for _, queryKey := range paginationOptions.QueryKeys {
// 			if queryValue := ctx.Query(queryKey); queryValue != "" {
// 				requestQueriesAndParams = append(requestQueriesAndParams, fmt.Sprintf("\"%s\" = '%s'", queryKey, queryValue))
// 			}
// 		}

// 		for _, paramKey := range paginationOptions.ParamKeys {
// 			if paramValue := ctx.Params(paramKey); paramValue != "" {
// 				requestQueriesAndParams = append(requestQueriesAndParams, fmt.Sprintf("\"%s\" = '%s'", paramKey, paramValue))
// 			}
// 		}

// 		requestQueryParams := strings.Join(requestQueriesAndParams, " AND ")

// 		reqPageNo := utils.Ternary(reqQuery.Page == 0, 1, reqQuery.Page)
// 		reqPageLimit := min(utils.Ternary(reqQuery.Limit == 0, 10, reqQuery.Limit), 50)

// 		db, err := utils.GetPostgresDB()
// 		if err != nil {
// 			return ctx.SendStatus(fiber.StatusInternalServerError)
// 		}

// 		if paginationOptions.Populate != nil {
// 			for _, populate := range paginationOptions.Populate {
// 				db = db.Preload(populate)
// 			}
// 		}

// 		if !paginationOptions.IncludeSoftDeleted {
// 			db = db.Where("deleted = false")
// 		}

// 		if paginationOptions.ReturnOnlyDeleted {
// 			db = db.Where("deleted = true")
// 		}

// 		var docsCount int64 = 0
// 		db = db.Where(fmt.Sprintf("\"workspaceId\" = '%s'", workspaceId))
// 		if err := db.Table(tableName).Where(requestQueryParams).Count(&docsCount).Error; err != nil {
// 			return ctx.SendStatus(fiber.StatusInternalServerError)
// 		}

// 		results := []Model{}
// 		if err := db.Where(requestQueryParams).Order("id DESC").Limit(reqPageLimit).Offset((reqPageNo - 1) * reqPageLimit).Find(&results).Error; err != nil {
// 			return ctx.SendStatus(fiber.StatusInternalServerError)
// 		}

// 		paginationResponse := utils.PaginationResponse[Model]{
// 			Docs:            results,
// 			Limit:           reqPageLimit,
// 			Count:           len(results),
// 			TotalDocs:       docsCount,
// 			CurrentPage:     reqPageNo,
// 			HasNextPage:     docsCount > int64(reqPageNo*reqPageLimit),
// 			HasPreviousPage: reqPageNo > 1,
// 		}

// 		return ctx.Status(fiber.StatusOK).JSON(paginationResponse)
// 	}
// }

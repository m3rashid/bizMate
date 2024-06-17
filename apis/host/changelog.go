package host

import (
	"bizmate/models"
	"bizmate/utils"

	"github.com/gofiber/fiber/v2"
)

func getAllChangelogs(ctx *fiber.Ctx) error {
	reqQuery := utils.PaginationRequestQuery{}
	if err := ctx.QueryParser(&reqQuery); err != nil {
		return ctx.Status(fiber.StatusBadRequest).JSON("Bad Request")
	}

	reqPageNo := utils.Ternary(reqQuery.Page == 0, 1, reqQuery.Page)
	reqPageLimit := min(utils.Ternary(reqQuery.Limit == 0, 10, reqQuery.Limit), 50)

	db, err := utils.GetHostDB()
	if err != nil {
		return ctx.SendStatus(fiber.StatusInternalServerError)
	}

	var docsCount int64 = 0
	if err := db.Table(models.CHANGELOG_MODEL_NAME).Count(&docsCount).Error; err != nil {
		return ctx.SendStatus(fiber.StatusInternalServerError)
	}

	results := []models.Changelog{}
	if err := db.Order("id DESC").Limit(reqQuery.Limit).Offset((reqQuery.Page - 1) * reqQuery.Limit).Find(&results).Error; err != nil {
		return ctx.SendStatus(fiber.StatusInternalServerError)
	}

	return ctx.Status(fiber.StatusOK).JSON(utils.PaginationResponse[models.Changelog]{
		Docs:            results,
		Limit:           reqPageLimit,
		Count:           len(results),
		TotalDocs:       docsCount,
		CurrentPage:     reqPageNo,
		HasNextPage:     docsCount > int64(reqPageNo*reqPageLimit),
		HasPreviousPage: reqPageNo > 1,
	})
}

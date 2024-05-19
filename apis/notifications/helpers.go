package notifications

import (
	"bizmate/models"
	"bizmate/utils"
	"strconv"

	"github.com/go-playground/validator/v10"
	"github.com/gofiber/fiber/v2"
)

type CreateNotificationBody struct {
	Title       string `json:"title" validate:"required"`
	Description string `json:"description,omitempty" validate:""`
	Link        string `json:"link,omitempty" validate:""`
	Scope       string `json:"scope" validate:"required"`
	Read        bool   `json:"read" validate:"required"`
}

func CreateNotification(tenantUrl string, notification CreateNotificationBody) error {
	validate := validator.New()
	err := validate.Struct(notification)
	if err != nil {
		return err
	}

	db, err := utils.GetTenantDBFromTenantUrl(tenantUrl)
	if err != nil {
		return err
	}

	if err = db.Create(models.WebUiNotification{
		Title:       notification.Title,
		Description: notification.Description,
		Link:        notification.Link,
		Scope:       notification.Scope,
		Read:        false,
	}).Error; err != nil {
		return err
	}

	return nil
}

func getNotifications(ctx *fiber.Ctx) error {
	scope := ctx.Params("scope")
	_page := ctx.Params("page")
	_limit := ctx.Params("limit")

	if scope == "" || _page == "" || _limit == "" {
		return ctx.Status(fiber.StatusBadRequest).JSON(utils.DefaultPaginationResponse)
	}

	page, err := strconv.Atoi(_page)
	if err != nil {
		return ctx.Status(fiber.StatusBadRequest).JSON(utils.DefaultPaginationResponse)
	}

	maxLimit := 20
	limit, err := strconv.Atoi(_limit)
	if err != nil {
		return ctx.Status(fiber.StatusBadRequest).JSON(utils.DefaultPaginationResponse)
	}

	if limit > maxLimit {
		return ctx.Status(fiber.StatusBadRequest).JSON(utils.DefaultPaginationResponse)
	}

	db, err := utils.GetTenantDbFromCtx(ctx)
	if err != nil {
		return ctx.Status(fiber.StatusInternalServerError).JSON(utils.DefaultPaginationResponse)
	}

	var docsCount int64
	var results []models.WebUiNotification

	if err := db.Order("id DESC").Limit(limit).Offset(int((page - 1) * limit)).Find(&results).Error; err != nil {
		return ctx.Status(fiber.StatusInternalServerError).JSON(utils.DefaultPaginationResponse)
	}

	if err := db.Order("id DESC").Count(&docsCount); err != nil {
		return ctx.Status(fiber.StatusInternalServerError).JSON(utils.DefaultPaginationResponse)
	}

	response := utils.PaginationResponse[models.WebUiNotification]{
		Docs:            results,
		Limit:           limit,
		HasPreviousPage: page > 1,
		CurrentPage:     page,
		Count:           int(len(results)),
		TotalDocs:       docsCount,
		HasNextPage:     docsCount > int64(page*limit),
	}

	return ctx.Status(fiber.StatusOK).JSON(response)
}

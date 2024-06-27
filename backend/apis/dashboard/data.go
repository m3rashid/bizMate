package dashboard

import (
	"bizMate/models"
	"bizMate/utils"
	"fmt"

	"github.com/gofiber/fiber/v2"
)

func getDataForWidget(ctx *fiber.Ctx) error {
	dashboardId := ctx.Params("dashboardId")
	widgetId := ctx.Params("widgetId")

	if dashboardId == "" || widgetId == "" {
		return ctx.SendStatus(fiber.StatusBadRequest)
	}

	db, err := utils.GetDB()
	if err != nil {
		return ctx.SendStatus(fiber.StatusInternalServerError)
	}

	widget := models.Widget{}
	if err := db.Where("\"widgetId\" = ? AND \"dashboardId\" = ?", widgetId, dashboardId).Error; err != nil {
		return ctx.SendStatus(fiber.StatusNotFound)
	}

	fmt.Printf("Widget: %+v\n", widget)

	return nil
}

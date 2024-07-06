package dashboards

import (
	"bizMate/models"
	"bizMate/utils"
	"fmt"

	"github.com/gofiber/fiber/v2"
)

func getDataForChart(ctx *fiber.Ctx) error {
	dashboardId := ctx.Params("dashboardId")
	chartId := ctx.Params("chartId")

	if dashboardId == "" || chartId == "" {
		return fiber.NewError(fiber.StatusBadRequest, "Invalid dashboard or chart ID")
	}

	db, err := utils.GetPostgresDB()
	if err != nil {
		return fiber.NewError(fiber.StatusInternalServerError)
	}

	chart := models.DashboardChart{}
	if err := db.Where("\"chartId\" = ? AND \"dashboardId\" = ?", chartId, dashboardId).Error; err != nil {
		return fiber.NewError(fiber.StatusNotFound, "Chart not found")
	}

	fmt.Printf("Chart: %+v\n", chart)

	return nil
}

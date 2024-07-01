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
		return ctx.SendStatus(fiber.StatusBadRequest)
	}

	db, err := utils.GetDB()
	if err != nil {
		return ctx.SendStatus(fiber.StatusInternalServerError)
	}

	chart := models.DashboardChart{}
	if err := db.Where("\"chartId\" = ? AND \"dashboardId\" = ?", chartId, dashboardId).Error; err != nil {
		return ctx.SendStatus(fiber.StatusNotFound)
	}

	fmt.Printf("Chart: %+v\n", chart)

	return nil
}

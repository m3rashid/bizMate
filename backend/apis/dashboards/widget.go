package dashboards

import (
	"bizMate/utils"

	"github.com/gofiber/fiber/v2"
)

func createChartForDashboard(ctx *fiber.Ctx) error {
	return ctx.Status(fiber.StatusOK).JSON(utils.SendResponse(nil, "hello from createChartForDashboard"))
}

func updateChartForDashboard(ctx *fiber.Ctx) error {
	return ctx.Status(fiber.StatusOK).JSON(utils.SendResponse(nil, "hello from updateChartForDashboard"))
}

package dashboard

import "github.com/gofiber/fiber/v2"

func createChartForDashboard(ctx *fiber.Ctx) error {
	return ctx.SendString("hello from createChartForDashboard")
}

func updateChartForDashboard(ctx *fiber.Ctx) error {
	return ctx.SendString("hello from updateChartForDashboard")
}

package dashboard

import "github.com/gofiber/fiber/v2"

func createWidgetForDashboard(ctx *fiber.Ctx) error {
	return ctx.SendString("hello from createWidgetForDashboard")
}

func updateWidgetForDashboard(ctx *fiber.Ctx) error {
	return ctx.SendString("hello from updateWidgetForDashboard")
}

func deleteWidgetForDashboard(ctx *fiber.Ctx) error {
	return ctx.SendString("hello from deleteWidgetForDashboard")
}

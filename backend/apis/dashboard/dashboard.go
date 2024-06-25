package dashboard

import (
	"github.com/gofiber/fiber/v2"
)

func createDashboard(ctx *fiber.Ctx) error {
	return ctx.SendString("Hello createDashboard")
}

func updateDashboard(ctx *fiber.Ctx) error {
	return ctx.SendString("Hello updateDashboard")
}

func deleteDashboard(ctx *fiber.Ctx) error {
	return ctx.SendString("Hello deleteDashboard")
}

package dashboard

import "github.com/gofiber/fiber/v2"

func createKPI(ctx *fiber.Ctx) error {
	return ctx.SendString("Hello from createKPI")
}

func updateKPI(ctx *fiber.Ctx) error {
	return ctx.SendString("Hello from updateKPI")
}

func deleteKPI(ctx *fiber.Ctx) error {
	return ctx.SendString("Hello from deleteKPI")
}

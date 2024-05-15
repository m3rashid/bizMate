package dashboard

import "github.com/gofiber/fiber/v2"

func getAllModels(ctx *fiber.Ctx) error {
	return ctx.SendString("Hello getAllModels")
}

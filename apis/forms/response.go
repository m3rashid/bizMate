package forms

import "github.com/gofiber/fiber/v2"

func getFormReports(ctx *fiber.Ctx) error {
	return ctx.SendString("Hello, World!")
}

func submitFormResponse(ctx *fiber.Ctx) error {
	return ctx.SendString("Hello, World!")
}

func editFormResponse(ctx *fiber.Ctx) error {
	return ctx.SendString("Hello, World!")
}

func deleteFormResponse(ctx *fiber.Ctx) error {
	return ctx.SendString("Hello, World!")
}

package payments

import (
	"bizMate/utils"

	"github.com/go-playground/validator/v10"
	"github.com/gofiber/fiber/v2"
)

func getStripeConfig(ctx *fiber.Ctx) error {
	return ctx.Status(fiber.StatusOK).JSON(fiber.Map{
		"publicKey": utils.Env.StripePublicKey,
	})
}

func createStripePaymentIntent(ctx *fiber.Ctx) error {
	intentBody := struct {
		Amount int `json:"amount" validate:"required"`
	}{}

	if err := ctx.BodyParser(&intentBody); err != nil {
		return ctx.Status(fiber.StatusBadRequest).JSON("Invalid request body")
	}

	validate := validator.New()
	if err := validate.Struct(intentBody); err != nil {
		return ctx.Status(fiber.StatusBadRequest).JSON("Required parameters missing")
	}

	return ctx.SendString("createStripePaymentIntent")
}

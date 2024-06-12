package payments

import (
	"os"

	"github.com/go-playground/validator/v10"
	"github.com/gofiber/fiber/v2"
)

func getStripeConfig(ctx *fiber.Ctx) error {
	publicKey := os.Getenv("STRIPE_PUBLIC_KEY")
	return ctx.Status(fiber.StatusOK).JSON(fiber.Map{
		"publicKey": publicKey,
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

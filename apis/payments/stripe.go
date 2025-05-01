package payments

import (
	"bizMate/utils"

	"github.com/gofiber/fiber/v2"
)

func getStripeConfig(ctx *fiber.Ctx) error {
	return ctx.Status(fiber.StatusOK).JSON(fiber.Map{
		"publicKey": utils.Env.StripePublicKey,
	})
}

func createStripePaymentIntent(ctx *fiber.Ctx) error {
	// intentBody := struct {
	// 	Amount int `json:"amount" validate:"required"`
	// }{}

	return ctx.SendString("createStripePaymentIntent")
}

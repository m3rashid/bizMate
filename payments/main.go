package payments

import "github.com/gofiber/fiber/v2"

func Setup(app *fiber.App) {
	app.Get("/payments/stripe/config", getStripeConfig)
	app.Post("/payments/stripe/create-payment-intent", createStripePaymentIntent)
}

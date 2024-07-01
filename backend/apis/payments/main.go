package payments

import "github.com/gofiber/fiber/v2"

func Setup(initialRoute string, app *fiber.App) {
	app.Get(initialRoute+"/stripe/config", getStripeConfig)
	app.Post(initialRoute+"/stripe/create-payment-intent", createStripePaymentIntent)
}

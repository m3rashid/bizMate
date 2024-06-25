package drive

import "github.com/gofiber/fiber/v2"

func Setup(app *fiber.App) {
	app.Post("/drive/get-signed-url", uploadFile)
}

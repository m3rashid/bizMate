package host

import "github.com/gofiber/fiber/v2"

func Setup(app *fiber.App) {
	app.Get("/host/changelogs/all", getAllChangelogs)
}

package seed

import (
	"bizMate/utils"

	"github.com/gofiber/fiber/v2"
)

func Setup(app *fiber.App) {
	app.Post("/seed/users", utils.CheckAuthMiddleware, seedUsers)
	app.Post("/seed/contacts", utils.CheckAuthMiddleware, seedContacts)
	app.Post("/seed/projects", utils.CheckAuthMiddleware, seedProjects)
}

package seed

import (
	"bizMate/utils"

	"github.com/gofiber/fiber/v2"
)

func Setup(initialRoute string, app *fiber.App) {
	app.Post(initialRoute+"/users", utils.CheckAuthMiddleware, seedUsers)
	app.Post(initialRoute+"/contacts", utils.CheckAuthMiddleware, seedContacts)
	app.Post(initialRoute+"/projects", utils.CheckAuthMiddleware, seedProjects)
}

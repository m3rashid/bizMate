package seed

import (
	"bizMate/utils"

	"github.com/gofiber/fiber/v2"
)

func Setup(initialRoute string, app *fiber.App) {
	app.Post(initialRoute+"/users", utils.CheckAuthMiddlewareWithoutWorkspace, seedUsers)
	app.Post(initialRoute+"/contacts", utils.CheckAuthMiddlewareWithoutWorkspace, seedContacts)
	app.Post(initialRoute+"/projects", utils.CheckAuthMiddlewareWithoutWorkspace, seedProjects)
}

package seed

import (
	"bizMate/utils"

	"github.com/gofiber/fiber/v2"
)

func Setup(initialRoute string, app *fiber.App) {
	app.Post(initialRoute+"/users", utils.CheckAuthMiddlewareWithWorkspace, seedUsers)
	app.Post(initialRoute+"/contacts", utils.CheckAuthMiddlewareWithWorkspace, seedContacts)
	app.Post(initialRoute+"/projects", utils.CheckAuthMiddlewareWithWorkspace, seedProjects)
}

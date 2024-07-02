package automations

import (
	"bizMate/controllers"
	"bizMate/models"
	"bizMate/utils"

	"github.com/gofiber/fiber/v2"
)

func Setup(initialRoute string, app *fiber.App) {
	app.Get(initialRoute+"/all", utils.CheckAuthMiddlewareWithWorkspace, controllers.Paginate[models.Workflow]())
}

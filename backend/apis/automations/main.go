package automations

import (
	"bizMate/controllers"
	"bizMate/models"
	"bizMate/utils"

	"github.com/gofiber/fiber/v2"
)

func Setup(app *fiber.App) {
	app.Get("/automations/all", utils.CheckAuthMiddleware, controllers.Paginate[models.Workflow]())
}

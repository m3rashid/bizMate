package workflows

import (
	"bizmate/controllers"
	"bizmate/models"
	"bizmate/utils"

	"github.com/gofiber/fiber/v2"
)

func Setup(app *fiber.App) {
	app.Get("/automations/all", utils.CheckAuthMiddleware, controllers.Paginate[models.Workflow]())
}

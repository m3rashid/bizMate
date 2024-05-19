package workflows

import (
	"bizmate/controllers"
	"bizmate/models"
	"bizmate/utils"

	"github.com/gofiber/fiber/v2"
)

func Setup(app *fiber.App) {
	// add APIs here
	app.Get("/automations/all", utils.CheckAuthMiddleware, controllers.Paginate[models.Workflow](models.WORKFLOW_MODEL_NAME))
}

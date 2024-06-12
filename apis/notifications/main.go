package notifications

import (
	"bizmate/controllers"
	"bizmate/models"
	"bizmate/utils"

	"github.com/gofiber/fiber/v2"
)

func Setup(app *fiber.App) {
	app.Get("/notifications", utils.CheckAuthMiddleware, getNotifications)
	app.Get("/email-templates/all", utils.CheckAuthMiddleware, controllers.Paginate[models.EmailTemplate]())
}

package notifications

import (
	"bizmate/utils"

	"github.com/gofiber/fiber/v2"
)

func Setup(app *fiber.App) {
	app.Get("/notifications", utils.CheckAuthMiddleware, getNotifications)
}

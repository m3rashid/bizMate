package dashboard

import (
	"bizMate/utils"

	"github.com/gofiber/fiber/v2"
)

func Setup(initialRoute string, app *fiber.App) {
	app.Get(
		initialRoute+"/workspace-home",
		utils.CheckAuthMiddlewareWithWorkspace,
		getWorkspaceDashboard,
	)
}

package export

import (
	"bizMate/utils"

	"github.com/gofiber/fiber/v2"
)

func Setup(initialRoute string, app *fiber.App) {
	app.Post(
		initialRoute+"/table",
		utils.CheckAuthMiddlewareWithWorkspace,
		// permissions.CheckPermissionMiddleware(repository., repository.PermissionLevelExport), // TODO: handle this permission
		exportTable,
	)

	app.Post(initialRoute+"/table-fields", utils.CheckAuthMiddlewareWithWorkspace, getExportTableFields)
}

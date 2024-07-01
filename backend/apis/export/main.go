package export

import (
	"bizMate/utils"

	"github.com/gofiber/fiber/v2"
)

func Setup(initialRoute string, app *fiber.App) {
	app.Post(initialRoute+"/table", utils.CheckAuthMiddleware, exportTable)
	app.Post(initialRoute+"/table-fields", utils.CheckAuthMiddleware, getExportTableFields)
}

package export

import (
	"bizmate/utils"

	"github.com/gofiber/fiber/v2"
)

func Setup(app *fiber.App) {
	app.Post("/table/export", utils.CheckAuthMiddleware, exportTable)

	app.Post("/table/export/table-fields", utils.CheckAuthMiddleware, getExportTableFields)
}

package forms

import (
	"bizmate/utils"

	"github.com/gofiber/fiber/v2"
)

func Setup(app *fiber.App) {
	app.Get("/forms/:id", getFormById)
	app.Post("/forms/create", utils.CheckAuthMiddleware, createForm)
	app.Post("/forms/delete/:id", utils.CheckAuthMiddleware, deleteForm)
	app.Post("/forms/update/:id", utils.CheckAuthMiddleware, updateFormById)
	app.Get("/forms/all", utils.CheckAuthMiddleware, getPaginatedForms)
	app.Get("/forms/reports/:id", utils.CheckAuthMiddleware, getFormReports)
}

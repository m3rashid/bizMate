package forms

import (
	"bizmate/utils"

	"github.com/gofiber/fiber/v2"
)

func Setup(app *fiber.App) {
	app.Get("/forms/one/:id", getFormById)
	app.Post("/forms/create", utils.CheckAuthMiddleware, createForm)
	app.Get("/forms/all", utils.CheckAuthMiddleware, getPaginatedForms)
	app.Post("/forms/update", utils.CheckAuthMiddleware, updateFormById)
	app.Post("/forms/delete/:id", utils.CheckAuthMiddleware, deleteForm)

	app.Post("/forms/response/submit/:formId", submitFormResponse)
	app.Post("/forms/response/edit", utils.CheckAuthMiddleware, editFormResponse)
	app.Get("/forms/response/report/:formId", utils.CheckAuthMiddleware, getFormReports)
	app.Post("/forms/response/delete/:formResponseId", utils.CheckAuthMiddleware, deleteFormResponse)
	// app.Post("/forms/response")
}

package forms

import (
	"bizmate/utils"

	"github.com/gofiber/fiber/v2"
)

func Setup(app *fiber.App) {
	app.Get("/forms/one/:formId", utils.CheckAuthMiddlewareButAllowUnauthorized, getFormById)
	app.Post("/forms/create", utils.CheckAuthMiddleware, createForm)
	app.Get("/forms/all", utils.CheckAuthMiddleware, getPaginatedForms)
	app.Post("/forms/update", utils.CheckAuthMiddleware, updateFormById)
	app.Post("/forms/delete/:formId", utils.CheckAuthMiddleware, deleteForm)

	app.Post("/forms/response/:formId/submit", utils.CheckAuthMiddlewareButAllowUnauthorized, submitFormResponse)
	app.Get("/forms/response/:formId/report", utils.CheckAuthMiddleware, getFormReports)
	app.Post("/forms/response/:formId/edit", utils.CheckAuthMiddleware, editFormResponse)
	app.Get("/forms/response/:formId/count", utils.CheckAuthMiddleware, getFormResponseCount)
	app.Get("/forms/response/:formId/all", utils.CheckAuthMiddleware, getPaginatedFormResponses)
}

package forms

import (
	"bizmate/controllers"
	"bizmate/models"
	"bizmate/utils"

	"github.com/gofiber/fiber/v2"
)

func Setup(app *fiber.App) {
	app.Get("/forms/one/:formId", utils.CheckAuthMiddlewareButAllowUnauthorized, controllers.Get[models.Form](
		controllers.GetOptions{ParamValue: "formId", ParamKey: "id"},
	))

	app.Post("/forms/create", utils.CheckAuthMiddleware, createNewForm)

	app.Get("/forms/all", utils.CheckAuthMiddleware, controllers.Paginate[models.Form]())

	app.Post("/forms/update", utils.CheckAuthMiddleware, updateFormById)

	app.Post("/forms/delete/:formId", utils.CheckAuthMiddleware, controllers.Delete(
		controllers.DeleteOptions[models.Form]{ParamValue: "formId", ParamKey: "id"},
	))

	app.Post("/forms/response/:formId/submit", utils.CheckAuthMiddlewareButAllowUnauthorized, submitFormResponse)

	app.Get("/forms/response/:formId/report", utils.CheckAuthMiddleware, getFormReports)

	app.Post("/forms/response/:formId/edit", utils.CheckAuthMiddleware, editFormResponse)

	app.Get("/forms/response/:formId/count", utils.CheckAuthMiddleware, getFormResponseCount)

	app.Get("/forms/response/:formId/all", utils.CheckAuthMiddleware, controllers.Paginate[models.FormResponse](
		controllers.PaginateOptions{ParamKeys: []string{"formId"}},
	))
}

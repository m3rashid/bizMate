package forms

import (
	"bizMate/utils"

	"github.com/gofiber/fiber/v2"
)

func Setup(initialRoute string, app *fiber.App) {
	app.Get(initialRoute+"/one/:formId", utils.CheckAuthMiddlewareButAllowUnauthorized, getOneForm)

	app.Post(initialRoute+"/create", utils.CheckAuthMiddlewareWithWorkspace, createNewForm)

	app.Post(initialRoute+"/:formId/update-form-body", utils.CheckAuthMiddlewareWithWorkspace, updateFormBody)

	app.Post(initialRoute+"/update", utils.CheckAuthMiddlewareWithWorkspace, updateFormById)

	app.Get(initialRoute+"/all", utils.CheckAuthMiddlewareWithWorkspace, paginateForms)

	app.Get(initialRoute+"/analysis/:formId", utils.CheckAuthMiddlewareWithWorkspace, getFormResponseAnalysis)

	app.Post(initialRoute+"/delete/:formId", utils.CheckAuthMiddlewareButAllowUnauthorized, deleteFormById)

	app.Post(initialRoute+"/response/:formId/submit", utils.CheckAuthMiddlewareButAllowUnauthorized, submitFormResponse)

	app.Get(initialRoute+"/response/:formId/count", utils.CheckAuthMiddlewareWithWorkspace, getFormResponseCount)

	app.Get(initialRoute+"/response/:formId/all", utils.CheckAuthMiddlewareWithWorkspace, paginateFormResponses)
}

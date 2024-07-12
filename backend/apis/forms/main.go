package forms

import (
	"bizMate/utils"

	"github.com/gofiber/fiber/v2"
)

func Setup(initialRoute string, app *fiber.App) {
	app.Get(initialRoute+"/one/:formId", utils.CheckAuthMiddlewareButAllowUnauthorized, getOneForm)

	app.Get(initialRoute+"/body/:formId", utils.CheckAuthMiddlewareButAllowUnauthorized, getFormBodyById)

	app.Post(initialRoute+"/create", utils.CheckAuthMiddlewareWithWorkspace, createNewForm)

	app.Post(initialRoute+"/:formId/create-new-form-innerbody", utils.CheckAuthMiddlewareWithWorkspace, createNewFormInnerBody)

	app.Post(initialRoute+"/update", utils.CheckAuthMiddlewareWithWorkspace, updateFormById)

	app.Get(initialRoute+"/all", utils.CheckAuthMiddlewareWithWorkspace, paginateForms)

	app.Get(initialRoute+"/analysis/:formId", utils.CheckAuthMiddlewareWithWorkspace, getFormResponseAnalysis)

	app.Post(initialRoute+"/response/:formId/submit", utils.CheckAuthMiddlewareButAllowUnauthorized, submitFormResponse)

	app.Post(initialRoute+"/response/:formId/edit", utils.CheckAuthMiddlewareWithWorkspace, editFormResponse)

	app.Get(initialRoute+"/response/:formId/count", utils.CheckAuthMiddlewareWithWorkspace, getFormResponseCount)

	// app.Get(initialRoute+"/response/:formId/all", utils.CheckAuthMiddlewareWithWorkspace, controllers.Paginate[models.FormResponse](controllers.PaginateOptions{
	// 	ParamKeys: []string{"formId"},
	// }))
}

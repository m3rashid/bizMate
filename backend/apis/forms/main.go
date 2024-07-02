package forms

import (
	"bizMate/controllers"
	"bizMate/models"
	"bizMate/utils"

	"github.com/gofiber/fiber/v2"
)

func Setup(initialRoute string, app *fiber.App) {
	app.Get(initialRoute+"/one/:formId", utils.CheckAuthMiddlewareButAllowUnauthorized, controllers.Get[models.Form](controllers.GetOptions{
		ParamKey:               "id",
		ParamValue:             "formId",
		DontIncludeWorkspaceID: true,
	}))

	app.Post(initialRoute+"/create", utils.CheckAuthMiddlewareWithWorkspace, createNewForm)

	app.Get(initialRoute+"/all", utils.CheckAuthMiddlewareWithWorkspace, controllers.Paginate[models.Form]())

	app.Post(initialRoute+"/update", utils.CheckAuthMiddlewareWithWorkspace, updateFormById)

	app.Get(initialRoute+"/analysis/:formId", utils.CheckAuthMiddlewareWithWorkspace, getFormResponseAnalysis)

	app.Post(initialRoute+"/delete/:formId", utils.CheckAuthMiddlewareWithWorkspace, controllers.Delete(controllers.DeleteOptions[models.Form]{
		ParamKey:   "id",
		ParamValue: "formId",
	}))

	app.Post(initialRoute+"/response/:formId/submit", utils.CheckAuthMiddlewareButAllowUnauthorized, submitFormResponse)

	app.Post(initialRoute+"/response/:formId/edit", utils.CheckAuthMiddlewareWithWorkspace, editFormResponse)

	app.Get(initialRoute+"/response/:formId/count", utils.CheckAuthMiddlewareWithWorkspace, getFormResponseCount)

	app.Get(initialRoute+"/response/:formId/all", utils.CheckAuthMiddlewareWithWorkspace, controllers.Paginate[models.FormResponse](controllers.PaginateOptions{
		ParamKeys: []string{"formId"},
	}))
}

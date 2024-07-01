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

	app.Post(initialRoute+"/create", utils.CheckAuthMiddleware, createNewForm)

	app.Get(initialRoute+"/all", utils.CheckAuthMiddleware, controllers.Paginate[models.Form]())

	app.Post(initialRoute+"/update", utils.CheckAuthMiddleware, updateFormById)

	app.Get(initialRoute+"/analysis/:formId", utils.CheckAuthMiddleware, getFormResponseAnalysis)

	app.Post(initialRoute+"/delete/:formId", utils.CheckAuthMiddleware, controllers.Delete(controllers.DeleteOptions[models.Form]{
		ParamKey:   "id",
		ParamValue: "formId",
	}))

	app.Post(initialRoute+"/response/:formId/submit", utils.CheckAuthMiddlewareButAllowUnauthorized, submitFormResponse)

	app.Post(initialRoute+"/response/:formId/edit", utils.CheckAuthMiddleware, editFormResponse)

	app.Get(initialRoute+"/response/:formId/count", utils.CheckAuthMiddleware, getFormResponseCount)

	app.Get(initialRoute+"/response/:formId/all", utils.CheckAuthMiddleware, controllers.Paginate[models.FormResponse](controllers.PaginateOptions{
		ParamKeys: []string{"formId"},
	}))
}

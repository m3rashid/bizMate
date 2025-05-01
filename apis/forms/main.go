package forms

import (
	"bizMate/apis/permissions"
	"bizMate/repository"
	"bizMate/utils"

	"github.com/gofiber/fiber/v2"
)

func Setup(initialRoute string, app *fiber.App) {
	app.Get(initialRoute+"/one/:formId", utils.CheckAuthMiddlewareButAllowUnauthorized, getOneForm)

	app.Post(
		initialRoute+"/create",
		utils.CheckAuthMiddlewareWithWorkspace,
		permissions.CheckPermissionMiddleware(repository.FormObjectType, repository.PermissionLevelCreate),
		createNewForm,
	)

	app.Post(
		initialRoute+"/:formId/update-form-body",
		utils.CheckAuthMiddlewareWithWorkspace,
		permissions.CheckPermissionMiddleware(repository.FormObjectType, repository.PermissionLevelUpdate),
		updateFormBody,
	)

	app.Post(
		initialRoute+"/update",
		utils.CheckAuthMiddlewareWithWorkspace,
		permissions.CheckPermissionMiddleware(repository.FormObjectType, repository.PermissionLevelUpdate),
		updateFormById,
	)

	app.Get(
		initialRoute+"/all",
		utils.CheckAuthMiddlewareWithWorkspace,
		permissions.CheckPermissionMiddleware(repository.FormObjectType, repository.PermissionLevelRead),
		paginateForms,
	)

	app.Get(initialRoute+"/analysis/:formId", utils.CheckAuthMiddlewareWithWorkspace, getFormResponseAnalysis)

	app.Post(
		initialRoute+"/delete/:formId",
		utils.CheckAuthMiddlewareButAllowUnauthorized,
		permissions.CheckPermissionMiddleware(repository.FormObjectType, repository.PermissionLevelDelete),
		deleteFormById,
	)

	app.Post(
		initialRoute+"/response/:formId/submit",
		utils.CheckAuthMiddlewareButAllowUnauthorized,
		submitFormResponse,
	)

	app.Get(
		initialRoute+"/response/:formId/count",
		utils.CheckAuthMiddlewareWithWorkspace,
		permissions.CheckPermissionMiddleware(repository.FormResponsesObjectType, repository.PermissionLevelRead),
		getFormResponseCount,
	)

	app.Get(
		initialRoute+"/response/:formId/all",
		utils.CheckAuthMiddlewareWithWorkspace,
		permissions.CheckPermissionMiddleware(repository.FormResponsesObjectType, repository.PermissionLevelRead),
		paginateFormResponses,
	)
}

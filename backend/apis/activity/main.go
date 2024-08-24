package activity

import (
	"bizMate/apis/permissions"
	"bizMate/repository"
	"bizMate/utils"

	"github.com/gofiber/fiber/v2"
)

func Setup(initialRoute string, app *fiber.App) {
	app.Get(
		initialRoute+"/all",
		utils.CheckAuthMiddlewareWithWorkspace,
		permissions.CheckPermissionMiddleware(repository.ActivityObjectType, repository.PermissionLevelRead),
		paginateWorkspaceActivity,
	)

	app.Get(
		initialRoute+"/user/:userId/all",
		utils.CheckAuthMiddlewareWithWorkspace,
		permissions.CheckPermissionMiddleware(repository.ActivityObjectType, repository.PermissionLevelRead),
		paginateSingleUserActivity,
	)
}

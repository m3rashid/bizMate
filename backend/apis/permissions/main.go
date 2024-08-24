package permissions

import (
	"bizMate/repository"
	"bizMate/utils"

	"github.com/gofiber/fiber/v2"
)

func Setup(initialRoute string, app *fiber.App) {
	app.Get(initialRoute+"/all", utils.CheckAuthMiddlewareWithWorkspace, getUserPermissions)

	app.Get(
		initialRoute+"/roles/all",
		utils.CheckAuthMiddlewareWithWorkspace,
		paginateRolesByWorkspaceId,
	)

	app.Get(initialRoute+"/roles/:roleId", utils.CheckAuthMiddlewareWithWorkspace, getRoleById)

	app.Post(
		initialRoute+"/roles/create",
		utils.CheckAuthMiddlewareWithWorkspace,
		CheckPermissionMiddleware(repository.RoleObjectType, repository.PermissionLevelCreate),
		createRole,
	)

	app.Post(
		initialRoute+"/roles/update",
		utils.CheckAuthMiddlewareWithWorkspace,
		CheckPermissionMiddleware(repository.RoleObjectType, repository.PermissionLevelUpdate),
		updateRole,
	)

	app.Post(
		initialRoute+"/roles/delete",
		utils.CheckAuthMiddlewareWithWorkspace,
		CheckPermissionMiddleware(repository.RoleObjectType, repository.PermissionLevelDelete),
		deleteRole,
	)

	app.Post(
		initialRoute+"/roles/add-user",
		utils.CheckAuthMiddlewareWithWorkspace,
		CheckPermissionMiddleware(repository.PermissionObjectType, repository.PermissionLevelCreate),
		addUserToRole,
	)

	app.Post(
		initialRoute+"/roles/remove-user",
		utils.CheckAuthMiddlewareWithWorkspace,
		CheckPermissionMiddleware(repository.RoleObjectType, repository.PermissionLevelDelete),
		removeUserFromRole,
	)

	app.Post(
		initialRoute+"/roles/add-bare-permission",
		utils.CheckAuthMiddlewareWithWorkspace,
		CheckPermissionMiddleware(repository.PermissionObjectType, repository.PermissionLevelCreate),
		addBarePermissionFromUser,
	)

	app.Post(
		initialRoute+"/roles/remove-bare-permission",
		utils.CheckAuthMiddlewareWithWorkspace,
		CheckPermissionMiddleware(repository.PermissionObjectType, repository.PermissionLevelCreate),
		removeBarePermissionFromUser,
	)
}

package permissions

import (
	"bizMate/repository"
	"bizMate/utils"

	"github.com/gofiber/fiber/v2"
	"github.com/google/uuid"
)

func getUserPermissions(ctx *fiber.Ctx) error {
	userId, workspaceId := utils.GetUserAndWorkspaceIdsOrZero(ctx)
	if userId == uuid.Nil || workspaceId == uuid.Nil {
		return fiber.NewError(fiber.StatusUnauthorized)
	}

	pgConn, err := utils.GetPostgresDB()
	if err != nil {
		return fiber.NewError(fiber.StatusInternalServerError)
	}

	queries := repository.New(pgConn)
	roles, err := queries.GetRolesByUserId(ctx.Context(),
		repository.GetRolesByUserIdParams{UserID: userId, WorkspaceID: workspaceId},
	)
	if err != nil {
		go utils.LogError(userId, workspaceId, get_role_by_user_id_fail, utils.LogData{"error": err.Error()})
		return fiber.NewError(fiber.StatusInternalServerError)
	}

	barePermissions, err := queries.GetUserBarePermissions(ctx.Context(),
		repository.GetUserBarePermissionsParams{UserID: userId, WorkspaceID: workspaceId},
	)
	if err != nil {
		go utils.LogError(userId, workspaceId, user_not_found_by_id, utils.LogData{"error": err.Error()})
		return fiber.NewError(fiber.StatusInternalServerError)
	}

	permissions := []repository.SingleRolePermission{}
	for _, barePermission := range barePermissions {
		permissions = append(permissions, repository.SingleRolePermission{
			ObjectType: barePermission.ObjectType,
			ObjectID:   barePermission.UserID.String(),
			UserID:     barePermission.UserID.String(),
			Permission: barePermission.Permission,
		})
	}

	for _, role := range roles {
		permissions = append(permissions, role.Permissions...)
	}

	return ctx.Status(fiber.StatusOK).JSON(
		utils.SendResponse(permissions, "Permissions found successfully"),
	)
}

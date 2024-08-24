package permissions

import (
	"bizMate/repository"
	"bizMate/utils"
	"context"

	"github.com/gofiber/fiber/v2"
	"github.com/google/uuid"
)

func getUserPermissionsHelper(ctx context.Context, userId uuid.UUID, workspaceId uuid.UUID) (repository.RolePermissions, error) {
	pgConn, err := utils.GetPostgresDB()
	if err != nil {
		return nil, err
	}

	queries := repository.New(pgConn)
	roles, err := queries.GetRolesByUserId(
		ctx,
		repository.GetRolesByUserIdParams{
			UserID:      userId,
			WorkspaceID: workspaceId,
		},
	)
	if err != nil {
		return nil, err
	}

	barePermissions, err := queries.GetUserBarePermissions(
		ctx,
		repository.GetUserBarePermissionsParams{
			UserID:      userId,
			WorkspaceID: workspaceId,
		},
	)
	if err != nil {
		return nil, err
	}

	permissions := repository.RolePermissions{}
	for _, barePermission := range barePermissions {
		permissions = append(permissions, repository.SingleRolePermission{
			ObjectType: barePermission.ObjectType,
			ObjectID:   barePermission.UserID,
			UserID:     barePermission.UserID,
			Level:      barePermission.Level,
		})
	}

	for _, role := range roles {
		permissions = append(permissions, role.Permissions...)
	}

	return permissions, nil
}

func getUserPermissions(ctx *fiber.Ctx) error {
	userId, workspaceId := utils.GetUserAndWorkspaceIdsOrZero(ctx)
	if userId == uuid.Nil || workspaceId == uuid.Nil {
		return fiber.NewError(fiber.StatusUnauthorized)
	}

	permissions, err := getUserPermissionsHelper(ctx.Context(), userId, workspaceId)
	if err != nil {
		return fiber.NewError(fiber.StatusInternalServerError)
	}

	return ctx.Status(fiber.StatusOK).JSON(
		utils.SendResponse(permissions, "Permissions found successfully"),
	)
}

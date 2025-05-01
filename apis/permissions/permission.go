package permissions

import (
	"bizMate/i18n"
	"bizMate/repository"
	"bizMate/utils"
	"context"

	"github.com/gofiber/fiber/v2"
	"github.com/google/uuid"
)

func getUserBarePermissionsOnly(ctx *fiber.Ctx) error {
	_, workspaceId := utils.GetUserAndWorkspaceIdsOrZero(ctx)
	if workspaceId == uuid.Nil {
		return fiber.NewError(fiber.StatusUnauthorized)
	}

	userId := ctx.Params("userId")
	if userId == "" {
		return fiber.NewError(fiber.StatusBadRequest, i18n.ToLocalString(ctx, "User ID is required"))
	}

	userIdUuidV7, err := utils.StringToUuid(userId)
	if err != nil {
		return fiber.NewError(fiber.StatusBadRequest, i18n.ToLocalString(ctx, "Invalid User ID"))
	}

	pgConn, err := utils.GetPostgresDB()
	if err != nil {
		return fiber.NewError(fiber.StatusInternalServerError)
	}

	queries := repository.New(pgConn)
	barePermissions, err := queries.GetUserBarePermissions(
		ctx.Context(),
		repository.GetUserBarePermissionsParams{
			UserID:      userIdUuidV7,
			WorkspaceID: workspaceId,
		},
	)
	if err != nil {
		return fiber.NewError(fiber.StatusInternalServerError)
	}

	return ctx.Status(fiber.StatusOK).JSON(
		utils.SendResponse(barePermissions, i18n.ToLocalString(ctx, "Bare permissions fetched successfully")),
	)
}

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
		utils.SendResponse(permissions, i18n.ToLocalString(ctx, "Permissions fetched successfully")),
	)
}

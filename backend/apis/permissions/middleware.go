package permissions

import (
	"bizMate/repository"
	"bizMate/utils"

	"github.com/gofiber/fiber/v2"
	"github.com/google/uuid"
)

type CheckPermissionMiddlewareConfig struct {
	AllowWithoutWorkspace bool
	AllowWithoutUser      bool
	ObjectId              func(ctx *fiber.Ctx) uuid.UUID
}

func CheckPermissionMiddleware(
	ObjectType repository.ObjectType,
	PermissionLevel repository.PermissionLevel,
	_config ...CheckPermissionMiddlewareConfig,
) func(ctx *fiber.Ctx) error {
	config := utils.Ternary(len(_config) > 0, _config[0], CheckPermissionMiddlewareConfig{})

	return func(ctx *fiber.Ctx) error {
		userId, workspaceId := utils.GetUserAndWorkspaceIdsOrZero(ctx)
		if userId == uuid.Nil {
			if config.AllowWithoutUser {
				return ctx.Next()
			}
			return fiber.NewError(fiber.StatusUnauthorized)
		}

		if workspaceId == uuid.Nil {
			if config.AllowWithoutWorkspace {
				return ctx.Next()
			}
			return fiber.NewError(fiber.StatusUnauthorized)
		}

		permissions, err := getUserPermissionsHelper(ctx.Context(), userId, workspaceId)
		if err != nil {
			return fiber.NewError(fiber.StatusInternalServerError)
		}

		permitted := false
		for _, permission := range permissions {
			if ObjectType != permission.ObjectType {
				continue
			}

			// TODO: handle check for specific object id
			// if config.ObjectId != uuid.Nil && config.ObjectId != permission.ObjectID {
			// 	continue
			// }

			if permission.Level&PermissionLevel == PermissionLevel {
				permitted = true
				break
			}
		}

		if permitted {
			return ctx.Next()
		} else {
			return fiber.NewError(fiber.StatusUnauthorized)
		}
	}
}

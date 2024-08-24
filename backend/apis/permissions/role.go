package permissions

import (
	"bizMate/repository"
	"bizMate/utils"

	"github.com/gofiber/fiber/v2"
)

func createRole(ctx *fiber.Ctx) error {
	return nil
}

func getRoleById(ctx *fiber.Ctx) error {
	return nil
}

func paginateRolesByWorkspaceId(ctx *fiber.Ctx) error {
	_, workspaceId := utils.GetUserAndWorkspaceIdsOrZero(ctx)

	paginationRes := utils.PaginationResponse[repository.Role]{}
	if err := paginationRes.ParseQuery(ctx, 50); err != nil {
		return fiber.NewError(fiber.StatusBadRequest, "Incorrect Parameters")
	}

	pgConn, err := utils.GetPostgresDB()
	if err != nil {
		return fiber.NewError(fiber.StatusInternalServerError)
	}

	queries := repository.New(pgConn)
	roles, err := queries.PaginateRolesByWorkspaceId(ctx.Context(), repository.PaginateRolesByWorkspaceIdParams{
		WorkspaceID: workspaceId,
		Limit:       paginationRes.Limit,
		Offset:      (paginationRes.CurrentPage - 1) * paginationRes.Limit,
	})
	if err != nil {
		return fiber.NewError(fiber.StatusInternalServerError)
	}

	paginationRes.Docs = roles
	rolesCount, err := queries.GetRolesByWorkspaceIdCount(ctx.Context(), workspaceId)
	if err != nil {
		return fiber.NewError(fiber.StatusInternalServerError)
	}

	paginationRes.TotalDocs = rolesCount
	paginationRes.BuildPaginationResponse()

	return ctx.Status(fiber.StatusOK).JSON(
		utils.SendResponse(paginationRes, "Got roles successfully"),
	)
}

func updateRole(ctx *fiber.Ctx) error {
	return nil
}

func deleteRole(ctx *fiber.Ctx) error {
	return nil
}

func addUserToRole(ctx *fiber.Ctx) error {
	return nil
}

func removeUserFromRole(ctx *fiber.Ctx) error {
	return nil
}

func addBarePermissionFromUser(ctx *fiber.Ctx) error {
	return nil
}

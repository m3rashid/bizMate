package auth

import (
	"bizMate/repository"
	"bizMate/utils"

	"github.com/gofiber/fiber/v2"
)

func getWorkspaces(ctx *fiber.Ctx) error {
	userId, _ := utils.GetUserAndWorkspaceIdsOrZero(ctx)
	pgConn, err := utils.GetPostgresDB()
	if err != nil {
		return fiber.NewError(fiber.StatusInternalServerError)
	}

	queries := repository.New(pgConn)
	workspaces, err := queries.GetCurrentUserWorkspaces(ctx.Context(), userId)
	if err != nil {
		return fiber.NewError(fiber.StatusInternalServerError)
	}

	return ctx.Status(fiber.StatusOK).JSON(utils.SendResponse(workspaces, "Workspaces retrieved successfully"))
}

func createWorkspace(ctx *fiber.Ctx) error {
	reqBody := createWorkspaceReq{}
	if err := utils.ParseBodyAndValidate(ctx, &reqBody); err != nil {
		return fiber.NewError(fiber.StatusBadRequest, err.Error())
	}

	id, err := utils.GenerateUuidV7()
	if err != nil {
		return fiber.NewError(fiber.StatusInternalServerError)
	}

	userId, _ := utils.GetUserAndWorkspaceIdsOrZero(ctx)
	pgConn, err := utils.GetPostgresDB()
	if err != nil {
		return fiber.NewError(fiber.StatusInternalServerError)
	}

	queries := repository.New(pgConn)
	tx, err := pgConn.Begin(ctx.Context())
	if err != nil {
		return fiber.NewError(fiber.StatusInternalServerError)
	}

	txQueries := queries.WithTx(tx)

	workspace, err := txQueries.CreateWorkspace(ctx.Context(), repository.CreateWorkspaceParams{
		ID:          id,
		Name:        reqBody.Name,
		CreatedByID: userId,
		Description: &reqBody.Description,
	})

	if err != nil {
		tx.Rollback(ctx.Context())
		return fiber.NewError(fiber.StatusInternalServerError)
	}

	err = txQueries.AddUserToWorkspace(ctx.Context(), repository.AddUserToWorkspaceParams{
		UserID:      userId,
		WorkspaceID: workspace.ID,
	})

	if err != nil {
		tx.Rollback(ctx.Context())
		return fiber.NewError(fiber.StatusInternalServerError)
	}

	err = tx.Commit(ctx.Context())
	if err != nil {
		return fiber.NewError(fiber.StatusInternalServerError)
	}

	return ctx.Status(fiber.StatusOK).JSON(utils.SendResponse(workspace, "Workspace created successfully"))
}

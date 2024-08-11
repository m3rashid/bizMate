package auth

import (
	"bizMate/repository"
	"bizMate/utils"

	"github.com/gofiber/fiber/v2"
	"github.com/google/uuid"
)

func checkWorkspace(ctx *fiber.Ctx) error {
	_workspaceId := ctx.Params("workspaceId")
	if _workspaceId == "" {
		return fiber.NewError(fiber.StatusBadRequest)
	}

	workspaceUuid, err := utils.StringToUuid(_workspaceId)
	if err != nil {
		return fiber.NewError(fiber.StatusInternalServerError)
	}

	if workspaceUuid == uuid.Nil {
		return fiber.NewError(fiber.StatusInternalServerError)
	}

	var workspace repository.Workspace
	workspaces, ok := getWorkSpaceFromCache(workspaceUuid)
	if ok {
		return ctx.Status(fiber.StatusOK).JSON(utils.SendResponse(workspaces, "Valid Workspace"))
	}

	pgConn, err := utils.GetPostgresDB()
	if err != nil {
		return fiber.NewError(fiber.StatusInternalServerError)
	}

	queries := repository.New(pgConn)
	workspace, err = queries.GetWorkspaceById(ctx.Context(), workspaceUuid)
	if err != nil {
		utils.LogError(uuid.Nil, workspace.ID, workspace_not_found_by_id, utils.LogDataType{"error": err.Error()})
		return fiber.NewError(fiber.StatusBadRequest)
	}

	addWorkSpaceToCache(workspace)
	return ctx.Status(fiber.StatusOK).JSON(utils.SendResponse(workspace, "Valid Workspace"))
}

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

	for _, workspace := range workspaces {
		addWorkSpaceToCache(workspace)
	}

	return ctx.Status(fiber.StatusOK).JSON(utils.SendResponse(workspaces, "Workspaces retrieved successfully"))
}

func createWorkspace(ctx *fiber.Ctx) error {
	userId, _ := utils.GetUserAndWorkspaceIdsOrZero(ctx)
	if userId == uuid.Nil {
		return fiber.NewError(fiber.StatusUnauthorized, "Unauthorized")
	}
	reqBody := createWorkspaceReq{}
	if err := utils.ParseBodyAndValidate(ctx, &reqBody); err != nil {
		return fiber.NewError(fiber.StatusBadRequest, err.Error())
	}

	id, err := utils.GenerateUuidV7()
	if err != nil {
		return fiber.NewError(fiber.StatusInternalServerError)
	}

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
	addWorkSpaceToCache(workspace)
	return ctx.Status(fiber.StatusOK).JSON(utils.SendResponse(workspace, "Workspace created successfully"))
}

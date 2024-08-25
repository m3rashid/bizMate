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
		return fiber.NewError(fiber.StatusBadRequest)
	}

	go addWorkSpaceToCache(workspace)
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
		go addWorkSpaceToCache(workspace)
	}

	if len(workspaces) == 0 {
		workspaces = []repository.Workspace{}
	}

	return ctx.Status(fiber.StatusOK).JSON(utils.SendResponse(workspaces, "Workspaces retrieved successfully"))
}

func createWorkspace(ctx *fiber.Ctx) error {
	userId, _ := utils.GetUserAndWorkspaceIdsOrZero(ctx)
	userEmail := utils.GetUserEmailFromCtx(ctx)
	if userId == uuid.Nil {
		return fiber.NewError(fiber.StatusUnauthorized, "Unauthorized")
	}
	reqBody := createWorkspaceReq{}
	if err := utils.ParseBodyAndValidate(ctx, &reqBody); err != nil {
		go utils.LogError(
			create_workspace_fail,
			userEmail,
			uuid.Nil,
			repository.WorkspaceObjectType,
			repository.LogData{
				"error": err.Error(),
			},
		)
		return fiber.NewError(fiber.StatusBadRequest, err.Error())
	}

	newWorkspaceId, err := utils.GenerateUuidV7()
	if err != nil {
		return fiber.NewError(fiber.StatusInternalServerError)
	}

	newBarePermissionId, err := utils.GenerateUuidV7()
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
		ID:          newWorkspaceId,
		CreatedByID: userId,
		Name:        reqBody.Name,
		Color:       reqBody.Color,
		Description: &reqBody.Description,
	})

	if err != nil {
		go utils.LogError(
			create_workspace_fail,
			userEmail,
			newWorkspaceId,
			repository.WorkspaceObjectType,
			repository.LogData{
				"error": err.Error(),
			},
		)
		return tx.Rollback(ctx.Context())
	}

	if err = txQueries.AddUserToWorkspace(ctx.Context(), repository.AddUserToWorkspaceParams{
		UserID:      userId,
		WorkspaceID: newWorkspaceId,
	}); err != nil {
		go utils.LogError(
			create_workspace_fail,
			userEmail,
			newWorkspaceId,
			repository.WorkspaceObjectType,
			repository.LogData{
				"error": err.Error(),
			},
		)
		return tx.Rollback(ctx.Context())
	}

	if err := txQueries.AddBarePermissionToUser(ctx.Context(), repository.AddBarePermissionToUserParams{
		ID:          newBarePermissionId,
		UserID:      userId,
		WorkspaceID: newWorkspaceId,
		ObjectType:  repository.WorkspaceObjectType,
		Level:       repository.PermissionLevelAdmin,
	}); err != nil {
		go utils.LogError(
			create_workspace_fail,
			userEmail,
			newWorkspaceId,
			repository.WorkspaceObjectType,
			repository.LogData{
				"error": err.Error(),
			},
		)
		return tx.Rollback(ctx.Context())
	}

	err = tx.Commit(ctx.Context())
	if err != nil {
		go utils.LogError(
			create_workspace_fail,
			userEmail,
			newWorkspaceId,
			repository.WorkspaceObjectType,
			repository.LogData{
				"error": err.Error(),
			},
		)
		return fiber.NewError(fiber.StatusInternalServerError)
	}
	go addWorkSpaceToCache(workspace)
	go utils.LogInfo(
		create_workspace_success,
		userEmail,
		newWorkspaceId,
		repository.WorkspaceObjectType,
		repository.LogData{
			"name": workspace.Name,
		},
	)
	return ctx.Status(fiber.StatusOK).JSON(utils.SendResponse(workspace, "Workspace created successfully"))
}

func removeUserFromWorkspace(ctx *fiber.Ctx) error {
	userId, workspaceId := utils.GetUserAndWorkspaceIdsOrZero(ctx)
	userEmail := utils.GetUserEmailFromCtx(ctx)
	if userId == uuid.Nil {
		return fiber.NewError(fiber.StatusUnauthorized, "Unauthorized")
	}
	reqBody := removeUserFromWorkspaceReqBody{}
	if err := utils.ParseBodyAndValidate(ctx, &reqBody); err != nil {
		go utils.LogError(
			remove_user_from_workspace_fail,
			userEmail,
			workspaceId,
			repository.WorkspaceObjectType,
			repository.LogData{
				"error": err.Error(),
			},
		)
		return fiber.NewError(fiber.StatusBadRequest, err.Error())
	}

	pgConn, err := utils.GetPostgresDB()
	if err != nil {
		return fiber.NewError(fiber.StatusInternalServerError)
	}

	queries := repository.New(pgConn)
	if err := queries.RemoveUserFromWorkspace(ctx.Context(), repository.RemoveUserFromWorkspaceParams{
		UserID:      reqBody.UserID,
		WorkspaceID: workspaceId,
	}); err != nil {
		go utils.LogError(
			remove_user_from_workspace_fail,
			userEmail,
			workspaceId,
			repository.WorkspaceObjectType,
			repository.LogData{
				"error": err.Error(),
			},
		)
		return fiber.NewError(fiber.StatusInternalServerError)
	}

	go utils.LogInfo(
		remove_user_from_workspace_success,
		userEmail,
		workspaceId,
		repository.WorkspaceObjectType,
		repository.LogData{
			"userId": reqBody.UserID.String(),
		},
	)
	return ctx.Status(fiber.StatusOK).JSON(
		utils.SendResponse(nil, "User removed from workspace successfully"),
	)
}

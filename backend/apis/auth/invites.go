package auth

import (
	"bizMate/repository"
	"bizMate/utils"
	"fmt"

	"github.com/gofiber/fiber/v2"
	"github.com/google/uuid"
)

func acceptOrRejectWorkspaceInvite(ctx *fiber.Ctx) error {
	userId, _ := utils.GetUserAndWorkspaceIdsOrZero(ctx)
	userEmail := utils.GetUserEmailFromCtx(ctx)
	if userId == uuid.Nil {
		return fiber.NewError(fiber.StatusUnauthorized)
	}

	reqBody := acceptOrRejectWorkspaceInviteReq{}
	if err := utils.ParseBodyAndValidate(ctx, &reqBody); err != nil {
		go utils.LogError(user_login_fail, userEmail, uuid.Nil, repository.UserObjectType, repository.LogData{"error": err.Error()})
		return fiber.NewError(fiber.StatusBadRequest, err.Error())
	}

	if reqBody.InviteID == uuid.Nil {
		return fiber.NewError(fiber.StatusBadRequest, "invite_id is required")
	}

	pgConn, err := utils.GetPostgresDB()
	if err != nil {
		fmt.Println("not getting db")
		return fiber.NewError(fiber.StatusInternalServerError)
	}

	queries := repository.New(pgConn)

	user, err := queries.GetUserById(ctx.Context(), userId)
	if err != nil {
		go utils.LogError(user_login_fail, userEmail, uuid.Nil, repository.UserObjectType, repository.LogData{"error": err.Error()})
		return fiber.NewError(fiber.StatusInternalServerError)
	}

	if user.ID == uuid.Nil {
		return fiber.NewError(fiber.StatusUnauthorized)
	}

	if *reqBody.Accepted {
		tx, err := pgConn.Begin(ctx.Context())
		if err != nil {
			return fiber.NewError(fiber.StatusInternalServerError)
		}
		txQueries := queries.WithTx(tx)

		invite, err := txQueries.GetInviteById(ctx.Context(), reqBody.InviteID)
		if err != nil {
			tx.Rollback(ctx.Context())
			return fiber.NewError(fiber.StatusInternalServerError)
		}

		if err := txQueries.AddUserToWorkspace(ctx.Context(), repository.AddUserToWorkspaceParams{
			UserID:      userId,
			WorkspaceID: invite.WorkspaceID,
		}); err != nil {
			go utils.LogError(accept_workspace_invite_fail, userEmail, uuid.Nil, repository.WorkspaceInviteObjectType, repository.LogData{"error": err.Error()})
			tx.Rollback(ctx.Context())
			return fiber.NewError(fiber.StatusInternalServerError)
		}

		if err := txQueries.DeleteWorkspaceInvite(ctx.Context(), reqBody.InviteID); err != nil {
			go utils.LogError(accept_workspace_invite_fail, userEmail, uuid.Nil, repository.WorkspaceInviteObjectType, repository.LogData{"error": err.Error()})
			tx.Rollback(ctx.Context())
			return fiber.NewError(fiber.StatusInternalServerError)
		}

		if err := tx.Commit(ctx.Context()); err != nil {
			go utils.LogError(accept_workspace_invite_fail, userEmail, uuid.Nil, repository.WorkspaceInviteObjectType, repository.LogData{"error": err.Error()})
			tx.Rollback(ctx.Context())
			return fiber.NewError(fiber.StatusInternalServerError)
		}

		go utils.LogInfo(accept_workspace_invite_success, userEmail, uuid.Nil, repository.WorkspaceInviteObjectType, repository.LogData{"invite_id": reqBody.InviteID.String()})
	} else {
		if err := queries.DeleteWorkspaceInvite(ctx.Context(), userId); err != nil {
			go utils.LogError(reject_workspace_invite_fail, userEmail, uuid.Nil, repository.WorkspaceInviteObjectType, repository.LogData{"error": err.Error()})
			return fiber.NewError(fiber.StatusInternalServerError)
		}

		go utils.LogInfo(reject_workspace_invite_success, userEmail, uuid.Nil, repository.WorkspaceInviteObjectType, repository.LogData{"invite_id": reqBody.InviteID.String()})
	}

	return ctx.Status(fiber.StatusOK).JSON(
		utils.SendResponse(
			nil,
			utils.Ternary(*reqBody.Accepted, "Invite accepted successfully", "Invite rejected successfully"),
		),
	)
}

func sendWorkspaceInvite(ctx *fiber.Ctx) error {
	userId, workspaceId := utils.GetUserAndWorkspaceIdsOrZero(ctx)
	userEmail := utils.GetUserEmailFromCtx(ctx)
	if userId == uuid.Nil || workspaceId == uuid.Nil {
		return fiber.NewError(fiber.StatusUnauthorized)
	}

	reqBody := sendWorkspaceInviteReq{}
	if err := utils.ParseBodyAndValidate(ctx, &reqBody); err != nil {
		go utils.LogError(send_workspace_invite_fail, userEmail, workspaceId, repository.WorkspaceInviteObjectType, repository.LogData{"error": err.Error()})
		return fiber.NewError(fiber.StatusBadRequest, err.Error())
	}

	uuidv7, err := utils.GenerateUuidV7()
	if err != nil {
		return fiber.NewError(fiber.StatusInternalServerError)
	}

	pgConn, err := utils.GetPostgresDB()
	if err != nil {
		fmt.Println("not getting db")
		return fiber.NewError(fiber.StatusInternalServerError)
	}

	queries := repository.New(pgConn)
	if err := queries.CreateWorkspaceInvite(ctx.Context(), repository.CreateWorkspaceInviteParams{
		ID:          uuidv7,
		WorkspaceID: workspaceId,
		Email:       reqBody.Email,
		CreatedByID: userId,
	}); err != nil {
		fmt.Println("error creating invite", err)
		go utils.LogError(send_workspace_invite_fail, userEmail, uuid.Nil, repository.WorkspaceInviteObjectType, repository.LogData{"error": err.Error()})
		return fiber.NewError(fiber.StatusInternalServerError)
	}

	go utils.LogInfo(send_workspace_invite_success, userEmail, workspaceId, repository.WorkspaceInviteObjectType, repository.LogData{"invite_id": uuidv7.String()})
	return ctx.Status(fiber.StatusOK).JSON(
		utils.SendResponse(nil, "Invite sent successfully"),
	)
}

func revokeWorkspaceInvite(ctx *fiber.Ctx) error {
	_, workspaceId := utils.GetUserAndWorkspaceIdsOrZero(ctx)
	userEmail := utils.GetUserEmailFromCtx(ctx)
	reqBody := revokeWorkspaceInviteReq{}
	if err := utils.ParseBodyAndValidate(ctx, &reqBody); err != nil {
		go utils.LogError(revoke_workspace_invite_fail, userEmail, workspaceId, repository.WorkspaceInviteObjectType, repository.LogData{"error": err.Error()})
		return fiber.NewError(fiber.StatusBadRequest, err.Error())
	}

	if reqBody.InviteID == uuid.Nil {
		return fiber.NewError(fiber.StatusBadRequest, "invite_id is required")
	}

	pgConn, err := utils.GetPostgresDB()
	if err != nil {
		fmt.Println("not getting db")
		return fiber.NewError(fiber.StatusInternalServerError)
	}

	queries := repository.New(pgConn)
	if err := queries.DeleteWorkspaceInvite(ctx.Context(), reqBody.InviteID); err != nil {
		go utils.LogError(revoke_workspace_invite_fail, userEmail, workspaceId, repository.WorkspaceInviteObjectType, repository.LogData{"error": err.Error()})
		return fiber.NewError(fiber.StatusInternalServerError)
	}

	go utils.LogInfo(revoke_workspace_invite_success, userEmail, workspaceId, repository.WorkspaceInviteObjectType, repository.LogData{"invite_id": reqBody.InviteID.String()})
	return nil
}

func getWorkspaceInvites(ctx *fiber.Ctx) error {
	userId, _ := utils.GetUserAndWorkspaceIdsOrZero(ctx)
	if userId == uuid.Nil {
		return fiber.NewError(fiber.StatusUnauthorized)
	}

	pgConn, err := utils.GetPostgresDB()
	if err != nil {
		fmt.Println("not getting db")
		return fiber.NewError(fiber.StatusInternalServerError)
	}

	queries := repository.New(pgConn)
	user, err := queries.GetUserById(ctx.Context(), userId)
	if err != nil {
		return fiber.NewError(fiber.StatusInternalServerError)
	}

	if user.ID == uuid.Nil {
		return fiber.NewError(fiber.StatusUnauthorized)
	}

	invites, err := queries.GetWorkspaceInviteByEmail(ctx.Context(), user.Email)
	if err != nil {
		return fiber.NewError(fiber.StatusInternalServerError)
	}

	return ctx.Status(fiber.StatusOK).JSON(
		utils.SendResponse(
			utils.Ternary(len(invites) > 0, invites, make([]repository.GetWorkspaceInviteByEmailRow, 0)),
			"Workspace invites fetched successfully",
		),
	)
}

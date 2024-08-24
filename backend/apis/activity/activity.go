package activity

import (
	"bizMate/repository"
	"bizMate/utils"

	"github.com/gofiber/fiber/v2"
	"github.com/google/uuid"
)

func paginateWorkspaceActivity(ctx *fiber.Ctx) error {
	_, workspaceid := utils.GetUserAndWorkspaceIdsOrZero(ctx)
	if workspaceid == uuid.Nil {
		return fiber.NewError(fiber.StatusBadRequest)
	}

	paginationRes := utils.PaginationResponse[repository.Log]{}
	if err := paginationRes.ParseQuery(ctx, 50); err != nil {
		return fiber.NewError(fiber.StatusBadRequest, "Incorrect parameters")
	}

	mongoConn, err := utils.GetMongoDB()
	if err != nil {
		return fiber.NewError(fiber.StatusInternalServerError)
	}
	logs, err := repository.PaginateWorkspaceActivity(
		ctx.Context(),
		mongoConn,
		repository.PaginateWorkspaceActivityParams{
			Limit:       int64(paginationRes.Limit),
			Offset:      int64(paginationRes.CurrentPage-1) * int64(paginationRes.Limit),
			WorkspaceID: workspaceid,
		},
	)
	if err != nil {
		return fiber.NewError(fiber.StatusInternalServerError)
	}

	paginationRes.Docs = logs
	logsCount, err := repository.GetWorkspaceActivityCount(ctx.Context(), mongoConn, workspaceid)
	if err != nil {
		return fiber.NewError(fiber.StatusInternalServerError)
	}

	paginationRes.TotalDocs = logsCount
	paginationRes.BuildPaginationResponse()

	return ctx.Status(fiber.StatusOK).JSON(
		utils.SendResponse(paginationRes, "Workspace activity fetched successfully"),
	)
}

func paginateSingleUserActivity(ctx *fiber.Ctx) error {
	_, workspaceId := utils.GetUserAndWorkspaceIdsOrZero(ctx)
	if workspaceId == uuid.Nil {
		return fiber.NewError(fiber.StatusBadRequest)
	}

	userEmail := ctx.Params("email")
	if userEmail == "" {
		return fiber.NewError(fiber.StatusBadRequest)
	}

	paginationRes := utils.PaginationResponse[repository.Log]{}
	if err := paginationRes.ParseQuery(ctx, 50); err != nil {
		return fiber.NewError(fiber.StatusBadRequest, "Incorrect parameters")
	}

	mongoConn, err := utils.GetMongoDB()
	if err != nil {
		return fiber.NewError(fiber.StatusInternalServerError)
	}
	logs, err := repository.PaginateSingleUserActivity(
		ctx.Context(),
		mongoConn,
		repository.PaginateSingleUserActivityParams{
			Limit:       int64(paginationRes.Limit),
			Offset:      int64(paginationRes.CurrentPage-1) * int64(paginationRes.Limit),
			WorkspaceID: workspaceId,
			UserEmail:   userEmail,
		},
	)
	if err != nil {
		return fiber.NewError(fiber.StatusInternalServerError)
	}

	paginationRes.Docs = logs
	logsCount, err := repository.GetSingleUserActivityCount(ctx.Context(), mongoConn, workspaceId, userEmail)
	if err != nil {
		return fiber.NewError(fiber.StatusInternalServerError)
	}

	paginationRes.TotalDocs = logsCount
	paginationRes.BuildPaginationResponse()

	return ctx.Status(fiber.StatusOK).JSON(
		utils.SendResponse(paginationRes, "User activity fetched successfully"),
	)
}

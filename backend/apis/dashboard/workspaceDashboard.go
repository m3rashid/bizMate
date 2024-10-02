package dashboard

import (
	"bizMate/i18n"
	"bizMate/repository"
	"bizMate/utils"

	"github.com/gofiber/fiber/v2"
	"github.com/google/uuid"
)

func getWorkspaceDashboard(ctx *fiber.Ctx) error {
	userId, workspaceId := utils.GetUserAndWorkspaceIdsOrZero(ctx)
	if userId == uuid.Nil || workspaceId == uuid.Nil {
		return fiber.NewError(fiber.StatusBadRequest, i18n.ToLocalString(ctx, "User or Workspace not present"))
	}

	if dashboardResponse, ok := getDashboardFromLocalCache(workspaceId.String()); ok {
		return ctx.Status(fiber.StatusOK).JSON(
			utils.SendResponse(dashboardResponse, i18n.ToLocalString(ctx, "Dashboard data fetched successfully")),
		)
	}

	pgConn, err := utils.GetPostgresDB()
	if err != nil {
		return fiber.NewError(fiber.StatusInternalServerError, err.Error())
	}

	queries := repository.New(pgConn)
	var dashboardResponse DashboardResponse

	formCounts, err := queries.CountFormsInWorkspace(ctx.Context(), workspaceId)
	if err != nil {
		return fiber.NewError(fiber.StatusInternalServerError, err.Error())
	}
	getFormCounts(&dashboardResponse, formCounts)

	usersCount, err := queries.CountUsersInWorkspace(ctx.Context(), workspaceId)
	if err != nil {
		return fiber.NewError(fiber.StatusInternalServerError, err.Error())
	}
	dashboardResponse.Users = usersCount

	go addDashboardToLocalCache(workspaceId.String(), dashboardResponse)

	return ctx.Status(fiber.StatusOK).JSON(
		utils.SendResponse(dashboardResponse, i18n.ToLocalString(ctx, "Dashboard data fetched successfully")),
	)
}

func getFormCounts(dashboardResponse *DashboardResponse, formCounts []repository.CountFormsInWorkspaceRow) {
	var activeFormCount int64 = 0
	var inactiveFormCount int64 = 0

	for _, formCount := range formCounts {
		if *formCount.Active {
			activeFormCount = formCount.Count
		} else {
			inactiveFormCount = formCount.Count
		}
	}

	dashboardResponse.Form = FormResponse{Active: activeFormCount, Inactive: inactiveFormCount}
}

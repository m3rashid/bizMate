package dashboards

import (
	"bizMate/repository"
	"bizMate/utils"

	"github.com/gofiber/fiber/v2"
)

func Setup(initialRoute string, app *fiber.App) {
	app.Get(initialRoute+"/models", utils.CheckAuthMiddlewareWithWorkspace, func(ctx *fiber.Ctx) error {
		return ctx.Status(fiber.StatusOK).JSON(utils.SendResponse(repository.DashboardIndexableJsonModels, ""))
	})

	app.Get(initialRoute+"/model-names/all", utils.CheckAuthMiddlewareWithWorkspace, func(c *fiber.Ctx) error {
		return c.Status(fiber.StatusOK).JSON(utils.SendResponse(repository.DashboardIndexableModelNames, ""))
	})

	// app.Get(initialRoute+"/all", utils.CheckAuthMiddlewareWithWorkspace, controllers.Paginate[models.Dashboard]())

	// app.Post(initialRoute+"/create", utils.CheckAuthMiddlewareWithWorkspace, controllers.Create(models.DASHBOARD_MODEL_NAME, controllers.CreateOptions[CreateDashboardBody, models.Dashboard]{
	// 	GetDefaultValues: func(values *CreateDashboardBody, ctx *fiber.Ctx) (*models.Dashboard, error) {
	// 		userId, workspaceId := utils.GetUserAndWorkspaceIdsOrZero(ctx)
	// 		return &models.Dashboard{
	// 			Title:                  values.Title,
	// 			Description:            values.Description,
	// 			CreatedBy:              models.CreatedBy{CreatedByID: userId.String()},
	// 			BaseModelWithWorkspace: models.BaseModelWithWorkspace{WorkspaceID: workspaceId.String()},
	// 		}, nil
	// 	},
	// }))

	// app.Post(initialRoute+"/update/:dashboardId", utils.CheckAuthMiddlewareWithWorkspace, controllers.Update(controllers.UpdateOptions[CreateDashboardBody, models.Dashboard]{
	// 	ParamKey:   "id",
	// 	ParamValue: "dashboardId",
	// }))

	// app.Post(initialRoute+"/delete/:dashboardId", utils.CheckAuthMiddlewareWithWorkspace, controllers.Delete(controllers.DeleteOptions[models.Dashboard]{
	// 	ParamKey:   "id",
	// 	ParamValue: "dashboardId",
	// }))

	// app.Post(initialRoute+"/kpis/:dashboardId/create", utils.CheckAuthMiddlewareWithWorkspace, controllers.Create(models.DASHBOARD_KPI_MODEL_NAME, controllers.CreateOptions[CreateKPIBody, models.DashboardKpi]{
	// 	GetDefaultValues: func(values *CreateKPIBody, ctx *fiber.Ctx) (*models.DashboardKpi, error) {
	// 		dId := ctx.Params("dashboardId")
	// 		if dId == "" {
	// 			return nil, fiber.NewError(fiber.StatusBadRequest, "Invalid dashboard ID")
	// 		}

	// 		dashboardId, err := uuid.Parse(dId)
	// 		if err != nil {
	// 			return nil, err
	// 		}

	// 		userId, workspaceId := utils.GetUserAndWorkspaceIdsOrZero(ctx)
	// 		return &models.DashboardKpi{
	// 			Title:                  values.Title,
	// 			Description:            values.Description,
	// 			DashboardID:            dashboardId.String(),
	// 			Model:                  values.Model,
	// 			ModelField:             values.ModelField,
	// 			AggregationType:        values.AggregationType,
	// 			TimePeriod:             values.TimePeriod,
	// 			CreatedBy:              models.CreatedBy{CreatedByID: userId.String()},
	// 			BaseModelWithWorkspace: models.BaseModelWithWorkspace{WorkspaceID: workspaceId.String()},
	// 		}, nil
	// 	},
	// }))

	// app.Post(initialRoute+"/kpis/update/:kpiId", utils.CheckAuthMiddlewareWithWorkspace, controllers.Update(controllers.UpdateOptions[CreateKPIBody, models.DashboardKpi]{
	// 	ParamKey:   "id",
	// 	ParamValue: "kpiId",
	// }))

	// app.Post(initialRoute+"/kpis/delete/:kpiId", utils.CheckAuthMiddlewareWithWorkspace, controllers.Delete(controllers.DeleteOptions[models.DashboardKpi]{
	// 	ParamKey:   "id",
	// 	ParamValue: "kpiId",
	// 	HardDelete: true,
	// }))

	// app.Get(initialRoute+"/charts/:dashboardId/all", utils.CheckAuthMiddlewareWithWorkspace, controllers.Paginate[models.DashboardChart](controllers.PaginateOptions{
	// 	ParamKeys: []string{"dashboardId"},
	// }))

	// app.Get(initialRoute+"/kpis/:dashboardId/all", utils.CheckAuthMiddlewareWithWorkspace, getAllKpiData)

	// app.Post(initialRoute+"/charts/create/:dashboardId", utils.CheckAuthMiddlewareWithWorkspace, createChartForDashboard)

	// app.Post(initialRoute+"/charts/update/:chartId", utils.CheckAuthMiddlewareWithWorkspace, updateChartForDashboard)

	// app.Post(initialRoute+"/charts/delete/:chartId", utils.CheckAuthMiddlewareWithWorkspace, controllers.Delete(controllers.DeleteOptions[models.DashboardChart]{
	// 	ParamKey:   "id",
	// 	ParamValue: "chartId",
	// 	HardDelete: true,
	// }))

	// data routes
	// app.Get(initialRoute+"/data/:dashboardId/:chartId", utils.CheckAuthMiddlewareWithWorkspace, getDataForChart)
}

package dashboards

import (
	"bizMate/controllers"
	"bizMate/models"
	"bizMate/utils"

	"github.com/gofiber/fiber/v2"
	"github.com/google/uuid"
)

func Setup(initialRoute string, app *fiber.App) {
	app.Get(initialRoute+"/models", utils.CheckAuthMiddleware, func(ctx *fiber.Ctx) error {
		return ctx.Status(fiber.StatusOK).JSON(models.DashboardIndexableJsonModels)
	})

	app.Get(initialRoute+"/model-names/all", utils.CheckAuthMiddleware, func(c *fiber.Ctx) error {
		return c.Status(fiber.StatusOK).JSON(models.DashboardIndexableModelNames)
	})

	app.Get(initialRoute+"/all", utils.CheckAuthMiddleware, controllers.Paginate[models.Dashboard]())

	app.Post(initialRoute+"/create", utils.CheckAuthMiddleware, controllers.Create(models.DASHBOARD_MODEL_NAME, controllers.CreateOptions[CreateDashboardBody, models.Dashboard]{
		GetDefaultValues: func(values *CreateDashboardBody, ctx *fiber.Ctx) (*models.Dashboard, error) {
			userId, workspaceId := utils.GetUserAndWorkspaceIdsOrZero(ctx)
			return &models.Dashboard{
				Title:                  values.Title,
				Description:            values.Description,
				CreatedBy:              models.CreatedBy{CreatedByID: userId.String()},
				BaseModelWithWorkspace: models.BaseModelWithWorkspace{WorkspaceID: workspaceId.String()},
			}, nil
		},
	}))

	app.Post(initialRoute+"/update/:dashboardId", utils.CheckAuthMiddleware, controllers.Update(controllers.UpdateOptions[CreateDashboardBody, models.Dashboard]{
		ParamKey:   "id",
		ParamValue: "dashboardId",
	}))

	app.Post(initialRoute+"/delete/:dashboardId", utils.CheckAuthMiddleware, controllers.Delete(controllers.DeleteOptions[models.Dashboard]{
		ParamKey:   "id",
		ParamValue: "dashboardId",
	}))

	app.Post(initialRoute+"/kpis/:dashboardId/create", utils.CheckAuthMiddleware, controllers.Create(models.DASHBOARD_KPI_MODEL_NAME, controllers.CreateOptions[CreateKPIBody, models.DashboardKpi]{
		GetDefaultValues: func(values *CreateKPIBody, ctx *fiber.Ctx) (*models.DashboardKpi, error) {
			dId := ctx.Params("dashboardId")
			if dId == "" {
				return nil, fiber.NewError(fiber.StatusBadRequest, "Invalid dashboard ID")
			}

			dashboardId, err := uuid.Parse(dId)
			if err != nil {
				return nil, err
			}

			userId, workspaceId := utils.GetUserAndWorkspaceIdsOrZero(ctx)
			return &models.DashboardKpi{
				Title:                  values.Title,
				Description:            values.Description,
				DashboardID:            dashboardId.String(),
				Model:                  values.Model,
				ModelField:             values.ModelField,
				AggregationType:        values.AggregationType,
				TimePeriod:             values.TimePeriod,
				CreatedBy:              models.CreatedBy{CreatedByID: userId.String()},
				BaseModelWithWorkspace: models.BaseModelWithWorkspace{WorkspaceID: workspaceId.String()},
			}, nil
		},
	}))

	app.Post(initialRoute+"/kpis/update/:kpiId", utils.CheckAuthMiddleware, controllers.Update(controllers.UpdateOptions[CreateKPIBody, models.DashboardKpi]{
		ParamKey:   "id",
		ParamValue: "kpiId",
	}))

	app.Post(initialRoute+"/kpis/delete/:kpiId", utils.CheckAuthMiddleware, controllers.Delete(controllers.DeleteOptions[models.DashboardKpi]{
		ParamKey:   "id",
		ParamValue: "kpiId",
		HardDelete: true,
	}))

	app.Get(initialRoute+"/charts/:dashboardId/all", utils.CheckAuthMiddleware, controllers.Paginate[models.DashboardChart](controllers.PaginateOptions{
		ParamKeys: []string{"dashboardId"},
	}))

	app.Get(initialRoute+"/kpis/:dashboardId/all", utils.CheckAuthMiddleware, getAllKpiData)

	app.Post(initialRoute+"/charts/create/:dashboardId", utils.CheckAuthMiddleware, createChartForDashboard)

	app.Post(initialRoute+"/charts/update/:chartId", utils.CheckAuthMiddleware, updateChartForDashboard)

	app.Post(initialRoute+"/charts/delete/:chartId", utils.CheckAuthMiddleware, controllers.Delete(controllers.DeleteOptions[models.DashboardChart]{
		ParamKey:   "id",
		ParamValue: "chartId",
		HardDelete: true,
	}))

	// data routes
	app.Get(initialRoute+"/data/:dashboardId/:chartId", utils.CheckAuthMiddleware, getDataForChart)
}

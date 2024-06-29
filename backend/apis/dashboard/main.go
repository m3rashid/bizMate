package dashboard

import (
	"bizMate/controllers"
	"bizMate/models"
	"bizMate/utils"
	"strconv"

	"github.com/gofiber/fiber/v2"
)

func Setup(app *fiber.App) {
	app.Get("/dashboards/models", utils.CheckAuthMiddleware, func(ctx *fiber.Ctx) error {
		return ctx.Status(fiber.StatusOK).JSON(models.DashboardIndexableJsonModels)
	})

	app.Get("/dashboards/model-names/all", utils.CheckAuthMiddleware, func(c *fiber.Ctx) error {
		return c.Status(fiber.StatusOK).JSON(models.DashboardIndexableModelNames)
	})

	app.Get("/dashboards/all", utils.CheckAuthMiddleware, controllers.Paginate[models.Dashboard]())

	app.Post("/dashboards/create", utils.CheckAuthMiddleware, controllers.Create(models.DASHBOARD_MODEL_NAME, controllers.CreateOptions[CreateDashboardBody, models.Dashboard]{
		GetDefaultValues: func(values *CreateDashboardBody, ctx *fiber.Ctx) (*models.Dashboard, error) {
			userId, tenantId := utils.GetUserAndTenantIdsOrZero(ctx)
			return &models.Dashboard{
				Title:       values.Title,
				Description: values.Description,
				CreatedBy:   models.CreatedBy{CreatedByID: userId},
				BaseModel:   models.BaseModel{TenantID: tenantId},
			}, nil
		},
	}))

	app.Post("/dashboards/update/:dashboardId", utils.CheckAuthMiddleware, controllers.Update(controllers.UpdateOptions[CreateDashboardBody, models.Dashboard]{
		ParamKey:   "id",
		ParamValue: "dashboardId",
	}))

	app.Post("/dashboards/delete/:dashboardId", utils.CheckAuthMiddleware, controllers.Delete(controllers.DeleteOptions[models.Dashboard]{
		ParamKey:   "id",
		ParamValue: "dashboardId",
	}))

	app.Post("/dashboards/kpis/:dashboardId/create", utils.CheckAuthMiddleware, controllers.Create(models.DASHBOARD_KPI_MODEL_NAME, controllers.CreateOptions[CreateKPIBody, models.DashboardKpi]{
		GetDefaultValues: func(values *CreateKPIBody, ctx *fiber.Ctx) (*models.DashboardKpi, error) {
			dashboardId := ctx.Params("dashboardId")
			dIdU64, err := strconv.ParseUint(dashboardId, 10, 32)
			if err != nil {
				return nil, err
			}
			userId, tenantId := utils.GetUserAndTenantIdsOrZero(ctx)
			return &models.DashboardKpi{
				Title:           values.Title,
				Description:     values.Description,
				DashboardID:     uint(dIdU64),
				Model:           values.Model,
				ModelField:      values.ModelField,
				AggregationType: values.AggregationType,
				TimePeriod:      values.TimePeriod,
				CreatedBy:       models.CreatedBy{CreatedByID: userId},
				BaseModel:       models.BaseModel{TenantID: tenantId},
			}, nil
		},
	}))

	app.Post("/dashboards/kpis/update/:kpiId", utils.CheckAuthMiddleware, controllers.Update(controllers.UpdateOptions[CreateKPIBody, models.DashboardKpi]{
		ParamKey:   "id",
		ParamValue: "kpiId",
	}))

	app.Post("/dashboards/kpis/delete/:kpiId", utils.CheckAuthMiddleware, controllers.Delete(controllers.DeleteOptions[models.DashboardKpi]{
		ParamKey:   "id",
		ParamValue: "kpiId",
		HardDelete: true,
	}))

	app.Get("/dashboards/charts/:dashboardId/all", utils.CheckAuthMiddleware, controllers.Paginate[models.DashboardChart](controllers.PaginateOptions{
		ParamKeys: []string{"dashboardId"},
	}))

	app.Get("/dashboards/kpis/:dashboardId/all", utils.CheckAuthMiddleware, getAllKpiData)

	app.Post("/dashboards/charts/create/:dashboardId", utils.CheckAuthMiddleware, createChartForDashboard)

	app.Post("/dashboards/charts/update/:chartId", utils.CheckAuthMiddleware, updateChartForDashboard)

	app.Post("/dashboards/charts/delete/:chartId", utils.CheckAuthMiddleware, controllers.Delete(controllers.DeleteOptions[models.DashboardChart]{
		ParamKey:   "id",
		ParamValue: "chartId",
		HardDelete: true,
	}))

	// data routes
	app.Get("/dashboards/data/:dashboardId/:chartId", utils.CheckAuthMiddleware, getDataForChart)
}

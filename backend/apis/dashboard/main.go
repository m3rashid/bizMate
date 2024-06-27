package dashboard

import (
	"bizMate/controllers"
	"bizMate/models"
	"bizMate/utils"

	"github.com/gofiber/fiber/v2"
)

func Setup(app *fiber.App) {
	app.Get("/dashboards/models", utils.CheckAuthMiddleware, func(ctx *fiber.Ctx) error {
		return ctx.Status(fiber.StatusOK).JSON(models.DashboardIndexableJsonModels)
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

	app.Get("/dashboards/kpis/all", utils.CheckAuthMiddleware, controllers.Paginate[models.Kpi]())

	app.Post("/dashboards/kpis/create", utils.CheckAuthMiddleware, createKPI)

	app.Post("/dashboards/kpis/update", utils.CheckAuthMiddleware, updateKPI)

	app.Post("/dashboards/kpis/delete/:kpiId", utils.CheckAuthMiddleware, deleteKPI)

	app.Get("/dashboards/kpis/:route", utils.CheckAuthMiddleware, controllers.Paginate[models.Kpi](controllers.PaginateOptions{
		ParamKeys: []string{"route"},
	}))

	app.Get("/dashboards/widgets/:dashboardId/all", utils.CheckAuthMiddleware, controllers.Paginate[models.Widget](controllers.PaginateOptions{
		ParamKeys: []string{"dashboardId"},
	}))

	app.Get("/dashboards/kpis/:dashboardId/all", utils.CheckAuthMiddleware, controllers.Paginate[models.Kpi](controllers.PaginateOptions{
		ParamKeys: []string{"dashboardId"},
	}))

	app.Post("/dashboards/widgets/:dashboardId/create", utils.CheckAuthMiddleware, createWidgetForDashboard)

	app.Post("/dashboards/widgets/:dashboardId/update", utils.CheckAuthMiddleware, updateWidgetForDashboard)

	app.Post("/dashboards/widgets/:dashboardId/delete/:widgetId", utils.CheckAuthMiddleware, deleteWidgetForDashboard)

	// data routes
	app.Get("/dashboards/data/:dashboardId/:widgetId/", utils.CheckAuthMiddleware, getDataForWidget)
}

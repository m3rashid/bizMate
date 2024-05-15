package dashboard

import (
	"bizmate/controllers"
	"bizmate/models"
	"bizmate/utils"

	"github.com/gofiber/fiber/v2"
)

func Setup(app *fiber.App) {
	app.Get("/dashboards/models", utils.CheckAuthMiddleware, getAllModels)
	app.Get("/dashboards/all", utils.CheckAuthMiddleware, controllers.Paginate[models.Dashboard](models.DASHBOARD_MODEL_NAME))
	app.Post("/dashboards/create", utils.CheckAuthMiddleware, createDashboard)
	app.Post("/dashboards/update", utils.CheckAuthMiddleware, updateDashboard)
	app.Post("/dashboards/delete/:dashboardId", utils.CheckAuthMiddleware, deleteDashboard)

	app.Get("/dashboards/kpis/all", utils.CheckAuthMiddleware, controllers.Paginate[models.Kpi](models.KPI_MODEL_NAME))
	app.Post("/dashboards/kpis/create", utils.CheckAuthMiddleware, createKPI)
	app.Post("/dashboards/kpis/update", utils.CheckAuthMiddleware, updateKPI)
	app.Post("/dashboards/kpis/delete/:kpiId", utils.CheckAuthMiddleware, deleteKPI)
	app.Get("/dashboards/kpis/:route", utils.CheckAuthMiddleware, controllers.Paginate[models.Kpi](models.KPI_MODEL_NAME, controllers.PaginateOptions{
		ParamKeys: []string{"route"},
	}))

	app.Get("/dashboards/widgets/all", utils.CheckAuthMiddleware, controllers.Paginate[models.Widget](models.WIDGET_MODEL_NAME))
	app.Post("/dashboards/widgets/:dashboardId", utils.CheckAuthMiddleware, controllers.Paginate[models.Widget](models.WIDGET_MODEL_NAME, controllers.PaginateOptions{
		ParamKeys: []string{"dashboardId"},
	}))
	app.Post("/dashboards/widgets/:dashboardId/create", utils.CheckAuthMiddleware, createWidgetForDashboard)
	app.Post("/dashboards/widgets/:dashboardId/update", utils.CheckAuthMiddleware, updateWidgetForDashboard)
	app.Post("/dashboards/widgets/:dashboardId/delete/:widgetId", utils.CheckAuthMiddleware, deleteWidgetForDashboard)
}

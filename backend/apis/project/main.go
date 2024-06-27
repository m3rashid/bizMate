package project

import (
	"bizMate/controllers"
	"bizMate/models"
	"bizMate/utils"

	"github.com/gofiber/fiber/v2"
)

func Setup(app *fiber.App) {
	app.Get("/projects/all", utils.CheckAuthMiddleware, controllers.Paginate[models.Project]())

	app.Get("/projects/one/:projectId", utils.CheckAuthMiddleware, controllers.Get[models.Project](controllers.GetOptions{
		Populate:   []string{"People"},
		ParamValue: "projectId",
		ParamKey:   "id",
	}))

	app.Post("/projects/create", utils.CheckAuthMiddleware, controllers.Create(models.PROJECT_MODEL_NAME, controllers.CreateOptions[projectReqBody, models.Project]{
		GetDefaultValues: func(values *projectReqBody, ctx *fiber.Ctx) (*models.Project, error) {
			userId, tenantId := utils.GetUserAndTenantIdsOrZero(ctx)
			return &models.Project{
				Name:        values.Name,
				Description: values.Description,
				Abandoned:   false,
				Completed:   false,
				People:      utils.Ternary(len(values.People) > 0, values.People, []*models.User{}),
				CreatedBy:   models.CreatedBy{CreatedByID: userId},
				BaseModel:   models.BaseModel{TenantID: tenantId},
			}, nil
		},
	}))

	app.Post("/projects/:projectId/update", utils.CheckAuthMiddleware, controllers.Update(controllers.UpdateOptions[projectEditReqBody, models.Project]{
		ParamKey:   "id",
		ParamValue: "projectId",
	}))

	app.Get("/projects/delete/:projectId", utils.CheckAuthMiddleware, controllers.Delete(controllers.DeleteOptions[models.Project]{
		ParamKey:   "id",
		ParamValue: "projectId",
	}))

	app.Get("/projects/:projectId/tasks/all", utils.CheckAuthMiddleware, controllers.Paginate[models.ProjectTask](controllers.PaginateOptions{
		ParamKeys: []string{"projectId"},
		Populate:  []string{"Assinees", "Tags"},
	}))

	app.Get("/tasks/children", utils.CheckAuthMiddleware, controllers.Paginate[models.ProjectTask](controllers.PaginateOptions{
		QueryKeys: []string{"parentTaskId"},
		Populate:  []string{"Assinees", "Tags"},
	}))

	app.Get("/tasks/one/:taskId", utils.CheckAuthMiddleware, controllers.Get[models.ProjectTask](controllers.GetOptions{
		Populate:   []string{"Assinees", "Tags", "CreatedByUser"},
		ParamKey:   "id",
		ParamValue: "taskId",
	}))

	app.Post("/tasks/create", utils.CheckAuthMiddleware, controllers.Create(models.TASK_MODEL_NAME, controllers.CreateOptions[ProjectTaskReqBody, models.ProjectTask]{
		GetDefaultValues: func(values *ProjectTaskReqBody, ctx *fiber.Ctx) (*models.ProjectTask, error) {
			userId, tenantId := utils.GetUserAndTenantIdsOrZero(ctx)
			return &models.ProjectTask{
				Title:        values.Title,
				Description:  values.Description,
				Status:       values.Status,
				Deadline:     values.Deadline,
				ProjectID:    values.ProjectID,
				Assinees:     utils.Ternary(len(values.Assinees) > 0, values.Assinees, []*models.User{}),
				Tags:         utils.Ternary(len(values.Tags) > 0, values.Tags, []*models.ProjectTag{}),
				ParentTaskID: values.ParentTaskID,
				CreatedBy:    models.CreatedBy{CreatedByID: userId},
				BaseModel:    models.BaseModel{TenantID: tenantId},
			}, nil
		},
	}))

	app.Post("/tasks/:taskId/update", utils.CheckAuthMiddleware, controllers.Update(controllers.UpdateOptions[ProjectTaskReqBody, models.ProjectTask]{
		ParamKey:   "id",
		ParamValue: "taskId",
	}))

	app.Post("/tasks/delete/:taskId", utils.CheckAuthMiddleware, controllers.Delete(controllers.DeleteOptions[models.ProjectTask]{
		ParamKey:   "id",
		ParamValue: "taskId",
	}))

	app.Get("/tasks/:taskId/comments/all", utils.CheckAuthMiddleware, controllers.Paginate[models.ProjectTaskEvent](controllers.PaginateOptions{
		ParamKeys: []string{"taskId"},
	}))

	app.Post("/tasks/comments/create", utils.CheckAuthMiddleware, controllers.Create(models.PROJECT_TASK_EVENT_MODEL_NAME, controllers.CreateOptions[models.ProjectTaskEvent, models.ProjectTaskEvent]{
		GetDefaultValues: func(values *models.ProjectTaskEvent, ctx *fiber.Ctx) (*models.ProjectTaskEvent, error) {
			userId, tenantId := utils.GetUserAndTenantIdsOrZero(ctx)
			return &models.ProjectTaskEvent{
				Data:      values.Data,
				TaskID:    values.TaskID,
				CreatedBy: models.CreatedBy{CreatedByID: userId},
				BaseModel: models.BaseModel{TenantID: tenantId},
			}, nil
		},
	}))

	app.Post("/tasks/comments/:commentId/update", utils.CheckAuthMiddleware, controllers.Update(controllers.UpdateOptions[models.ProjectTaskEvent, models.ProjectTaskEvent]{
		ParamKey:   "id",
		ParamValue: "commentId",
	}))

	app.Get("/tags/all", utils.CheckAuthMiddleware, controllers.Paginate[models.ProjectTag]())

	app.Post("/tags/create", utils.CheckAuthMiddleware, controllers.Create(models.TAG_MODEL_NAME, controllers.CreateOptions[models.ProjectTag, models.ProjectTag]{
		GetDefaultValues: func(values *models.ProjectTag, ctx *fiber.Ctx) (*models.ProjectTag, error) {
			_, tenantId := utils.GetUserAndTenantIdsOrZero(ctx)
			return &models.ProjectTag{
				Name:      values.Name,
				BaseModel: models.BaseModel{TenantID: tenantId},
			}, nil
		},
	}))

	app.Post("/tags/:tagId/update", utils.CheckAuthMiddleware, controllers.Update(controllers.UpdateOptions[models.ProjectTag, models.ProjectTag]{
		ParamKey:   "id",
		ParamValue: "tagId",
	}))

	app.Get("/tags/delete/:tagId", utils.CheckAuthMiddleware, controllers.Delete(controllers.DeleteOptions[models.ProjectTag]{
		ParamKey:   "id",
		ParamValue: "tagId",
	}))
}

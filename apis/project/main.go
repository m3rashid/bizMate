package project

import (
	"bizmate/controllers"
	"bizmate/models"
	"bizmate/utils"

	"github.com/gofiber/fiber/v2"
)

func Setup(app *fiber.App) {
	app.Get("/projects/all", utils.CheckAuthMiddleware, controllers.Paginate[models.Project]())

	app.Get("/projects/one/:projectId", utils.CheckAuthMiddleware, controllers.Get[models.Project](controllers.GetOptions{
		Populate:   []string{"People"},
		ParamValue: "projectId",
		ParamKey:   "id",
	}))

	app.Post("/projects/create", utils.CheckAuthMiddleware, controllers.Create[models.Project, models.Project](models.PROJECT_MODEL_NAME))

	app.Post("/projects/update", utils.CheckAuthMiddleware, controllers.Update[models.Project, models.Project]())

	app.Get("/projects/delete/:projectId", utils.CheckAuthMiddleware, controllers.Delete(controllers.DeleteOptions[models.Project]{
		ParamKey:   "id",
		ParamValue: "projectId",
	}))

	app.Get("/projects/:projectId/tasks/all", utils.CheckAuthMiddleware, controllers.Paginate[models.Task](controllers.PaginateOptions{
		ParamKeys: []string{"projectId"},
		Populate:  []string{"Assinees", "Tags"},
	}))

	app.Get("/tasks/one/:taskId", utils.CheckAuthMiddleware, controllers.Get[models.Task](controllers.GetOptions{
		Populate:   []string{"Assinees", "Tags"},
		ParamKey:   "id",
		ParamValue: "taskId",
	}))

	app.Post("/tasks/create", utils.CheckAuthMiddleware, controllers.Create[models.Task, models.Task](models.TASK_MODEL_NAME))

	app.Post("/tasks/update", utils.CheckAuthMiddleware, controllers.Update[models.Task, models.Task]())

	app.Get("/tasks/delete/:taskId", utils.CheckAuthMiddleware, controllers.Delete(controllers.DeleteOptions[models.Task]{
		ParamKey:   "id",
		ParamValue: "taskId",
	}))

	app.Get("/tasks/:taskId/comments/all", utils.CheckAuthMiddleware, controllers.Paginate[models.ProjectTaskComment](controllers.PaginateOptions{
		ParamKeys: []string{"taskId"},
	}))

	app.Post("/tasks/comments/create", utils.CheckAuthMiddleware, controllers.Create[models.ProjectTaskComment, models.ProjectTaskComment](models.PROJECT_TASK_COMMENT_MODEL_NAME))

	app.Post("/tasks/comments/update", utils.CheckAuthMiddleware, controllers.Update[models.ProjectTaskComment, models.ProjectTaskComment]())

	app.Get("/tags/all", utils.CheckAuthMiddleware, controllers.Paginate[models.Tag]())

	app.Post("/tags/create", utils.CheckAuthMiddleware, controllers.Create[models.Tag, models.Tag](models.TAG_MODEL_NAME))

	app.Post("/tags/update", utils.CheckAuthMiddleware, controllers.Update[models.Tag, models.Tag]())

	app.Get("/tags/delete/:tagId", utils.CheckAuthMiddleware, controllers.Delete(controllers.DeleteOptions[models.Tag]{
		ParamKey:   "id",
		ParamValue: "tagId",
	}))
}

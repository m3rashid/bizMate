package emailtemplates

import (
	"bizmate/controllers"
	"bizmate/models"
	"bizmate/utils"

	"github.com/gofiber/fiber/v2"
)

func Setup(app *fiber.App) {
	app.Get("/email-templates/all", utils.CheckAuthMiddleware, controllers.Paginate[models.EmailTemplate]())
	app.Post("/email-templates/create", utils.CheckAuthMiddleware, createEmailTemplate)
	app.Get("/email-templates/one/:templateId", utils.CheckAuthMiddleware, controllers.Get[models.EmailTemplate](
		controllers.GetOptions{ParamValue: "templateId", ParamKey: "id"},
	))
	app.Post("/email-templates/update/:templateId", utils.CheckAuthMiddleware, updateEmailTemplate)
	app.Post("/email-templates/delete/:templateId", utils.CheckAuthMiddleware, deleteEmailTemplate)
}

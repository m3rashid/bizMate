package notifications

import (
	"bizmate/controllers"
	"bizmate/models"
	"bizmate/utils"
	"fmt"
	"strings"

	"github.com/gofiber/fiber/v2"
)

func Setup(app *fiber.App) {
	app.Get("/notifications", utils.CheckAuthMiddleware, getNotifications)

	app.Get("/email-templates/all", utils.CheckAuthMiddleware, controllers.Paginate[models.EmailTemplate]())

	app.Get("/email-templates/one/:templateId", utils.CheckAuthMiddleware, controllers.Get[models.EmailTemplate](controllers.GetOptions{
		ParamValue: "templateId", ParamKey: "id",
	}))

	app.Post("/email-templates/delete/:templateId", utils.CheckAuthMiddleware, controllers.Delete(controllers.DeleteOptions[models.EmailTemplate]{
		ParamKey:   "id",
		ParamValue: "templateId",
	}))

	app.Post("/email-templates/create", utils.CheckAuthMiddleware, controllers.Create(
		models.EMAIL_TEMPLATE_MODEL_NAME,
		controllers.CreateOptions[emailTemplateReqBody, models.EmailTemplate]{
			GetDefaultValues: func(values *emailTemplateReqBody, ctx *fiber.Ctx) (*models.EmailTemplate, error) {
				userId := ctx.Locals("userId").(uint)
				emailHtmlTemplate := HTML{HtmlString: values.BodyTemplateHtml, SubjectString: values.SubjectTemplate}
				emailHtmlTemplate.removeCommentsAndCompress()
				variables := emailHtmlTemplate.getVariables()

				return &models.EmailTemplate{
					Title:                  values.Title,
					Description:            values.Description,
					CreatedBy:              models.CreatedBy{CreatedByID: userId},
					SubjectTemplate:        values.SubjectTemplate,
					BodyTemplateHtml:       values.BodyTemplateHtml,
					BodyTemplateDesignJson: values.BodyTemplateDesignJson,
					Variables:              fmt.Sprintf("[%s]", strings.Join(variables, ",")),
				}, nil
			},
		}),
	)
}

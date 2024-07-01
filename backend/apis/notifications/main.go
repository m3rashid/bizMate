package notifications

import (
	"bizMate/controllers"
	"bizMate/models"
	"bizMate/utils"
	"fmt"
	"strings"

	"github.com/gofiber/fiber/v2"
)

func Setup(app *fiber.App) {
	app.Get("/notifications", utils.CheckAuthMiddleware, controllers.Paginate[models.WorkspaceWebUiNotification]())

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
				userId, workspaceId := utils.GetUserAndWorkspaceIdsOrZero(ctx)
				emailHtmlTemplate := HTML{HtmlString: values.BodyTemplateHtml, SubjectString: values.SubjectTemplate}
				emailHtmlTemplate.removeCommentsAndCompress()
				variables := emailHtmlTemplate.getVariables()

				return &models.EmailTemplate{
					Title:                  values.Title,
					Description:            values.Description,
					SubjectTemplate:        values.SubjectTemplate,
					BodyTemplateHtml:       values.BodyTemplateHtml,
					BodyTemplateDesignJson: values.BodyTemplateDesignJson,
					BaseModelWithWorkspace: models.BaseModelWithWorkspace{WorkspaceID: workspaceId.String()},
					CreatedBy:              models.CreatedBy{CreatedByID: userId.String()},
					Variables:              fmt.Sprintf("[%s]", strings.Join(variables, ",")),
				}, nil
			},
		}),
	)
}

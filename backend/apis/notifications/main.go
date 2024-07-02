package notifications

import (
	"bizMate/controllers"
	"bizMate/models"
	"bizMate/utils"
	"fmt"
	"strings"

	"github.com/gofiber/fiber/v2"
)

func Setup(initialRoute string, app *fiber.App) {
	app.Get(initialRoute+"/webui/all", utils.CheckAuthMiddlewareWithWorkspace, controllers.Paginate[models.WorkspaceWebUiNotification]())

	app.Get(initialRoute+"/email-templates/all", utils.CheckAuthMiddlewareWithWorkspace, controllers.Paginate[models.EmailTemplate]())

	app.Get(initialRoute+"/email-templates/one/:templateId", utils.CheckAuthMiddlewareWithWorkspace, controllers.Get[models.EmailTemplate](controllers.GetOptions{
		ParamValue: "templateId", ParamKey: "id",
	}))

	app.Post(initialRoute+"/email-templates/delete/:templateId", utils.CheckAuthMiddlewareWithWorkspace, controllers.Delete(controllers.DeleteOptions[models.EmailTemplate]{
		ParamKey:   "id",
		ParamValue: "templateId",
	}))

	app.Post(initialRoute+"/email-templates/create", utils.CheckAuthMiddlewareWithWorkspace, controllers.Create(
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

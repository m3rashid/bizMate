package contacts

import (
	"bizMate/controllers"
	"bizMate/models"
	"bizMate/utils"

	"github.com/gofiber/fiber/v2"
)

func Setup(app *fiber.App) {
	app.Get("/contacts/all", utils.CheckAuthMiddleware, controllers.Paginate[models.Contact]())

	app.Post("/contacts/create", utils.CheckAuthMiddleware, controllers.Create(models.CONTACT_MODEL_NAME, controllers.CreateOptions[CreateContactReqBody, models.Contact]{
		GetDefaultValues: func(values *CreateContactReqBody, ctx *fiber.Ctx) (*models.Contact, error) {
			userId, workspaceId := utils.GetUserAndWorkspaceIdsOrZero(ctx)
			return &models.Contact{
				Name:                   values.Name,
				Email:                  values.Email,
				Birthday:               values.Birthday,
				Phone:                  values.Phone,
				CreatedBy:              models.CreatedBy{CreatedByID: userId},
				OtherPhones:            utils.SafeStringify(values.OtherPhones),
				OtherEmails:            utils.SafeStringify(values.OtherEmails),
				OtherDetails:           utils.SafeStringify(values.OtherDetails),
				BaseModelWithWorkspace: models.BaseModelWithWorkspace{WorkspaceID: workspaceId},
			}, nil
		},
	}))

	app.Post("/contacts/bulk-upload", utils.CheckAuthMiddleware, bulkContactsUpload)
}

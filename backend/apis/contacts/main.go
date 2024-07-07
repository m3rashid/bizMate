package contacts

import (
	"bizMate/utils"

	"github.com/gofiber/fiber/v2"
)

func Setup(initialRoute string, app *fiber.App) {
	// app.Get(initialRoute+"/all", utils.CheckAuthMiddlewareWithWorkspace, controllers.Paginate[models.Contact]())

	// app.Post(initialRoute+"/create", utils.CheckAuthMiddlewareWithWorkspace, controllers.Create(models.CONTACT_MODEL_NAME, controllers.CreateOptions[CreateContactReqBody, models.Contact]{
	// 	GetDefaultValues: func(values *CreateContactReqBody, ctx *fiber.Ctx) (*models.Contact, error) {
	// 		userId, workspaceId := utils.GetUserAndWorkspaceIdsOrZero(ctx)
	// 		return &models.Contact{
	// 			Name:                   values.Name,
	// 			Email:                  values.Email,
	// 			Birthday:               values.Birthday,
	// 			Phone:                  values.Phone,
	// 			CreatedBy:              models.CreatedBy{CreatedByID: userId.String()},
	// 			OtherPhones:            utils.SafeStringify(values.OtherPhones),
	// 			OtherEmails:            utils.SafeStringify(values.OtherEmails),
	// 			OtherDetails:           utils.SafeStringify(values.OtherDetails),
	// 			BaseModelWithWorkspace: models.BaseModelWithWorkspace{WorkspaceID: workspaceId.String()},
	// 		}, nil
	// 	},
	// }))

	app.Post(initialRoute+"/bulk-upload", utils.CheckAuthMiddlewareWithWorkspace, bulkContactsUpload)
}

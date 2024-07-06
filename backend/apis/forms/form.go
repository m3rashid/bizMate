package forms

import (
	"bizMate/models"
	"bizMate/utils"

	"github.com/gofiber/fiber/v2"
)

type formReqBody struct {
	ID                     string `json:"id,omitempty" required:""`
	Title                  string `json:"title" validate:"required"`
	Description            string `json:"description" validate:"required"`
	Body                   string `json:"body" validate:"required"`
	SubmitText             string `json:"submitText" validate:"required"`
	CancelText             string `json:"cancelText" validate:"required"`
	SuccessPage            string `json:"successPage,omitempty"`
	FailurePage            string `json:"failurePage,omitempty"`
	Active                 *bool  `json:"active" validate:"required"`
	AllowAnonymousResponse *bool  `json:"allowAnonymousResponse" validate:"required"`
	AllowResponseUpdate    *bool  `json:"allowResponseUpdate" validate:"required"`
	AllowMultipleResponse  *bool  `json:"allowMultipleResponse" validate:"required"`
	SendResponseEmail      *bool  `json:"sendResponseEmail" validate:"required"`
}

// var createNewForm = controllers.Create(models.FORM_MODEL_NAME, controllers.CreateOptions[formReqBody, models.Form]{
// 	GetDefaultValues: func(values *formReqBody, ctx *fiber.Ctx) (*models.Form, error) {
// 		userId, workspaceId := utils.GetUserAndWorkspaceIdsOrZero(ctx)
// 		return &models.Form{
// 			Title:                  values.Title,
// 			Body:                   values.Body,
// 			SubmitText:             values.SubmitText,
// 			CancelText:             values.CancelText,
// 			Description:            values.Description,
// 			SuccessPage:            "[]",
// 			FailurePage:            "[]",
// 			PreviousVersionIDs:     "[]",
// 			CreatedBy:              models.CreatedBy{CreatedByID: userId.String()},
// 			BaseModelWithWorkspace: models.BaseModelWithWorkspace{WorkspaceID: workspaceId.String()},
// 			Active:                 utils.Ternary(values.Active != nil, *values.Active, false),
// 			SendResponseEmail:      utils.Ternary(values.SendResponseEmail != nil, *values.SendResponseEmail, false),
// 			AllowResponseUpdate:    utils.Ternary(values.AllowResponseUpdate != nil, *values.AllowResponseUpdate, false),
// 			AllowAnonymousResponse: utils.Ternary(values.AllowAnonymousResponse != nil, *values.AllowAnonymousResponse, false),
// 			AllowMultipleResponse:  utils.Ternary(values.AllowMultipleResponse != nil, *values.AllowMultipleResponse, false),
// 		}, nil
// 	},
// })

func updateFormById(ctx *fiber.Ctx) error {
	updateBody := formReqBody{}
	userId, _ := utils.GetUserAndWorkspaceIdsOrZero(ctx)

	if err := utils.ParseBodyAndValidate(ctx, &updateBody); err != nil {
		return fiber.NewError(fiber.StatusBadRequest, err.Error())
	}

	if updateBody.ID == "" {
		return fiber.NewError(fiber.StatusBadRequest, "Bad Request")
	}

	// db, err := utils.GetPostgresDB()
	// if err != nil {
	// 	return fiber.NewError(fiber.StatusInternalServerError)
	// }

	form := models.Form{}
	// if err := db.Where("id = ?", updateBody.ID).First(&form).Error; err != nil {
	// 	return fiber.NewError(fiber.StatusInternalServerError)
	// }

	form.Title = updateBody.Title
	form.Description = updateBody.Description
	form.SubmitText = updateBody.SubmitText
	form.CancelText = updateBody.CancelText
	//  `body` and `previousVersionIDs` are not updatable fields because form may get inconsistent
	// form `body` cannot be updated, in case of update, new form should be created and old form should be marked as inactive, and `previousVersionIDs` field of the new form should be updated
	form.SuccessPage = utils.Ternary(updateBody.SuccessPage != "", updateBody.SuccessPage, form.SuccessPage)
	form.FailurePage = utils.Ternary(updateBody.FailurePage != "", updateBody.FailurePage, form.FailurePage)
	form.Active = utils.Ternary(updateBody.Active != nil, *updateBody.Active, false)
	form.AllowAnonymousResponse = utils.Ternary(updateBody.AllowAnonymousResponse != nil, *updateBody.AllowAnonymousResponse, false)
	form.AllowResponseUpdate = utils.Ternary(updateBody.AllowResponseUpdate != nil, *updateBody.AllowResponseUpdate, false)
	form.AllowMultipleResponse = utils.Ternary(updateBody.AllowMultipleResponse != nil, *updateBody.AllowMultipleResponse, false)
	userIdStr := userId.String()
	form.UpdatedBy.UpdatedByID = &userIdStr

	// if err := db.Save(&form).Error; err != nil {
	// 	return fiber.NewError(fiber.StatusInternalServerError)
	// }

	return ctx.Status(fiber.StatusOK).JSON(utils.SendResponse(nil, "Form updated successfully"))
}

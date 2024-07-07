package forms

import (
	"bizMate/repository"
	"bizMate/utils"

	"github.com/gofiber/fiber/v2"
	"github.com/google/uuid"
)

type formReqBody struct {
	Title                  string `json:"title" validate:"required, min=5, max=50"`
	Description            string `json:"description" validate:"max=50"`
	SubmitText             string `json:"submit_text" validate:"max=30"`
	CancelText             string `json:"cancel_text" validate:"max=30"`
	Active                 *bool  `json:"active"`
	IsStepForm             *bool  `json:"is_step_form"`
	SendResponseEmail      *bool  `json:"send_response_email"`
	AllowAnonymousResponse *bool  `json:"allow_anonymous_response"`
	AllowMultipleResponse  *bool  `json:"allow_multiple_response"`
}

func createNewForm(ctx *fiber.Ctx) error {
	userId, workspaceId := utils.GetUserAndWorkspaceIdsOrZero(ctx)
	if userId == uuid.Nil || workspaceId == uuid.Nil {
		return fiber.NewError(fiber.StatusBadRequest, "User or Workspace not present")
	}

	reqBody := formReqBody{}
	if err := utils.ParseBodyAndValidate(ctx, &reqBody); err != nil {
		return fiber.NewError(fiber.StatusBadRequest, err.Error())
	}

	id, err := utils.GenerateUuidV7()
	if err != nil {
		return fiber.NewError(fiber.StatusInternalServerError)
	}

	pgConn, err := utils.GetPostgresDB()
	if err != nil {
		return fiber.NewError(fiber.StatusInternalServerError)
	}

	queries := repository.New(pgConn)
	form, err := queries.CreateForm(ctx.Context(), repository.CreateFormParams{
		ID:                     id,
		WorkspaceID:            workspaceId,
		CreatedByID:            userId,
		Title:                  reqBody.Title,
		Description:            reqBody.Description,
		SubmitText:             reqBody.SubmitText,
		CancelText:             reqBody.CancelText,
		Active:                 reqBody.Active,
		IsStepForm:             reqBody.IsStepForm,
		SendResponseEmail:      reqBody.SendResponseEmail,
		AllowAnonymousResponse: reqBody.AllowAnonymousResponse,
		AllowMultipleResponse:  reqBody.AllowMultipleResponse,
	})

	if err != nil {
		return fiber.NewError(fiber.StatusInternalServerError)
	}

	return ctx.Status(fiber.StatusOK).JSON(utils.SendResponse(form, "Form Created Successfully"))
}

func addNewFormVersion(ctx *fiber.Ctx) error {
	return nil
}

func paginateForms(ctx *fiber.Ctx) error {
	return nil
}

func getOneForm(ctx *fiber.Ctx) error {
	_, workspaceId := utils.GetUserAndWorkspaceIdsOrZero(ctx)
	if workspaceId == uuid.Nil {
		return fiber.NewError(fiber.StatusBadRequest, "Unknown workspace")
	}

	_formId := ctx.Params("formId")
	if _formId == "" {
		return fiber.NewError(fiber.StatusBadRequest, "Unknown form")
	}

	formId, err := utils.StringToUuid(_formId)
	if err != nil {
		return fiber.NewError(fiber.StatusInternalServerError)
	}

	pgConn, err := utils.GetPostgresDB()
	if err != nil {
		return fiber.NewError(fiber.StatusInternalServerError)
	}

	queries := repository.New(pgConn)
	form, err := queries.GetFormById(ctx.Context(), repository.GetFormByIdParams{
		ID:          formId,
		WorkspaceID: workspaceId,
	})

	if err != nil {
		return fiber.NewError(fiber.StatusInternalServerError)
	}

	return ctx.Status(fiber.StatusOK).JSON(utils.SendResponse(form, "Form received successfully"))
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
	// updateBody := formReqBody{}
	// userId, _ := utils.GetUserAndWorkspaceIdsOrZero(ctx)

	// if err := utils.ParseBodyAndValidate(ctx, &updateBody); err != nil {
	// 	return fiber.NewError(fiber.StatusBadRequest, err.Error())
	// }

	// if updateBody.ID == "" {
	// 	return fiber.NewError(fiber.StatusBadRequest, "Bad Request")
	// }

	// db, err := utils.GetPostgresDB()
	// if err != nil {
	// 	return fiber.NewError(fiber.StatusInternalServerError)
	// }

	// form := models.Form{}
	// if err := db.Where("id = ?", updateBody.ID).First(&form).Error; err != nil {
	// 	return fiber.NewError(fiber.StatusInternalServerError)
	// }

	// form.Title = updateBody.Title
	// form.Description = updateBody.Description
	// form.SubmitText = updateBody.SubmitText
	// form.CancelText = updateBody.CancelText
	//  `body` and `previousVersionIDs` are not updatable fields because form may get inconsistent
	// form `body` cannot be updated, in case of update, new form should be created and old form should be marked as inactive, and `previousVersionIDs` field of the new form should be updated
	// form.SuccessPage = utils.Ternary(updateBody.SuccessPage != "", updateBody.SuccessPage, form.SuccessPage)
	// form.FailurePage = utils.Ternary(updateBody.FailurePage != "", updateBody.FailurePage, form.FailurePage)
	// form.Active = utils.Ternary(updateBody.Active != nil, *updateBody.Active, false)
	// form.AllowAnonymousResponse = utils.Ternary(updateBody.AllowAnonymousResponse != nil, *updateBody.AllowAnonymousResponse, false)
	// form.AllowResponseUpdate = utils.Ternary(updateBody.AllowResponseUpdate != nil, *updateBody.AllowResponseUpdate, false)
	// form.AllowMultipleResponse = utils.Ternary(updateBody.AllowMultipleResponse != nil, *updateBody.AllowMultipleResponse, false)
	// userIdStr := userId.String()
	// form.UpdatedBy.UpdatedByID = &userIdStr

	// if err := db.Save(&form).Error; err != nil {
	// 	return fiber.NewError(fiber.StatusInternalServerError)
	// }

	return ctx.Status(fiber.StatusOK).JSON(utils.SendResponse(nil, "Form updated successfully"))
}

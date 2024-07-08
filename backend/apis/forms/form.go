package forms

import (
	"bizMate/repository"
	"bizMate/utils"
	"fmt"

	"github.com/gofiber/fiber/v2"
	"github.com/google/uuid"
	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/bson/primitive"
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
	_, workspaceId := utils.GetUserAndWorkspaceIdsOrZero(ctx)
	if workspaceId == uuid.Nil {
		return fiber.NewError(fiber.StatusBadRequest, "Unknown workspace")
	}

	paginationRes := utils.PaginationResponse[repository.Form]{}
	if err := paginationRes.ParseQuery(ctx, 50); err != nil {
		return fiber.NewError(fiber.StatusBadRequest, "Incorrect Parameters")
	}

	pgConn, err := utils.GetPostgresDB()
	if err != nil {
		return fiber.NewError(fiber.StatusInternalServerError)
	}

	queries := repository.New(pgConn)
	forms, err := queries.PaginateForms(ctx.Context(), repository.PaginateFormsParams{
		WorkspaceID: workspaceId,
		Limit:       paginationRes.Limit,
		Offset:      (paginationRes.CurrentPage - 1) * paginationRes.Limit,
	})

	if err != nil {
		return fiber.NewError(fiber.StatusInternalServerError)
	}

	paginationRes.Docs = forms

	formsCount, err := queries.GetFormsCount(ctx.Context(), workspaceId)
	if err != nil {
		return fiber.NewError(fiber.StatusInternalServerError)
	}

	paginationRes.TotalDocs = formsCount
	paginationRes.BuildPaginationResponse()

	return ctx.Status(fiber.StatusOK).JSON(utils.SendResponse(paginationRes, "Got forms successfully"))
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

func createFormBody(ctx *fiber.Ctx) error {
	return nil
}

func getFormBodyById(ctx *fiber.Ctx) error {
	formBodyId := ctx.Params("formBodyId")
	if formBodyId == "" {
		return fiber.NewError(fiber.StatusBadRequest)
	}

	mongoDb, err := utils.GetMongoDB()
	if err != nil {
		return fiber.NewError(fiber.StatusInternalServerError)
	}

	formBody := repository.FormBody{}
	err = mongoDb.Collection(repository.FORM_BODY_COLLECTION_NAME).FindOne(ctx.Context(), bson.D{
		primitive.E{Key: "_id", Value: formBodyId},
	}).Decode(&formBody)
	if err != nil {
		return fiber.NewError(fiber.StatusBadRequest, "Form Body not found")
	}

	fmt.Printf("res: %+v\n", formBody)
	return ctx.Status(fiber.StatusOK).JSON(utils.SendResponse(formBody, "Form Fetched successfully"))
}

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

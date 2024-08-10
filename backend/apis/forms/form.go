package forms

import (
	"bizMate/repository"
	"bizMate/utils"

	"github.com/gofiber/fiber/v2"
	"github.com/google/uuid"
)

type CreateFormReqBody struct {
	Title                   string `json:"title" validate:"required,min=5,max=50"`
	Description             string `json:"description" validate:"max=50"`
	Active                  *bool  `json:"active"`
	SendResponseEmail       *bool  `json:"send_response_email"`
	AllowAnonymousResponses *bool  `json:"allow_anonymous_responses"`
	SubmitText              string `json:"submit_text" validate:"min=5,max=50"`
	CancelText              string `json:"cancel_text" validate:"min=5,max=50"`
	AllowMultipleResponses  *bool  `json:"allow_multiple_responses"`
}

type UpdateFormReqBody struct {
	CreateFormReqBody
	ID uuid.UUID `json:"id" validate:"required"`
}

func createNewForm(ctx *fiber.Ctx) error {
	userId, workspaceId := utils.GetUserAndWorkspaceIdsOrZero(ctx)
	if userId == uuid.Nil || workspaceId == uuid.Nil {
		return fiber.NewError(fiber.StatusBadRequest, "User or Workspace not present")
	}

	reqBody := CreateFormReqBody{}
	if err := utils.ParseBodyAndValidate(ctx, &reqBody); err != nil {
		return fiber.NewError(fiber.StatusBadRequest, err.Error())
	}

	id, err := utils.GenerateUuidV7()
	if err != nil {
		return fiber.NewError(fiber.StatusInternalServerError, err.Error())
	}

	pgConn, err := utils.GetPostgresDB()
	if err != nil {
		return fiber.NewError(fiber.StatusInternalServerError, err.Error())
	}

	queries := repository.New(pgConn)
	if err = queries.CreateForm(ctx.Context(), repository.CreateFormParams{
		ID:                      id,
		WorkspaceID:             workspaceId,
		CreatedByID:             userId,
		Title:                   reqBody.Title,
		Description:             reqBody.Description,
		Active:                  reqBody.Active,
		SendResponseEmail:       reqBody.SendResponseEmail,
		AllowAnonymousResponses: reqBody.AllowAnonymousResponses,
		AllowMultipleResponses:  reqBody.AllowMultipleResponses,
		SubmitText:              &reqBody.SubmitText,
		CancelText:              &reqBody.CancelText,
	}); err != nil {
		return fiber.NewError(fiber.StatusInternalServerError)
	}

	return ctx.Status(fiber.StatusOK).JSON(utils.SendResponse(nil, "Form Created Successfully"))
}

func paginateForms(ctx *fiber.Ctx) error {
	_, workspaceId := utils.GetUserAndWorkspaceIdsOrZero(ctx)
	if workspaceId == uuid.Nil {
		return fiber.NewError(fiber.StatusBadRequest, "Unknown workspace")
	}

	paginationRes := utils.PaginationResponse[repository.PaginateFormsRow]{}
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
	form, err := queries.GetFormById(ctx.Context(), repository.GetFormByIdParams{ID: formId, WorkspaceID: workspaceId})
	if err != nil {
		return fiber.NewError(fiber.StatusInternalServerError)
	}

	return ctx.Status(fiber.StatusOK).JSON(utils.SendResponse(form, "Form received successfully"))
}

func updateFormById(ctx *fiber.Ctx) error {
	userId, workspaceId := utils.GetUserAndWorkspaceIdsOrZero(ctx)
	if userId == uuid.Nil || workspaceId == uuid.Nil {
		return fiber.NewError(fiber.StatusBadRequest, "User or Workspace not present")
	}

	reqBody := UpdateFormReqBody{}
	if err := utils.ParseBodyAndValidate(ctx, &reqBody); err != nil {
		return fiber.NewError(fiber.StatusBadRequest, err.Error())
	}

	pgConn, err := utils.GetPostgresDB()
	if err != nil {
		return fiber.NewError(fiber.StatusInternalServerError)
	}

	queries := repository.New(pgConn)
	if err = queries.UpdateForm(ctx.Context(), repository.UpdateFormParams{
		ID:                      reqBody.ID,
		Title:                   reqBody.Title,
		Description:             reqBody.Description,
		Active:                  reqBody.Active,
		SendResponseEmail:       reqBody.SendResponseEmail,
		AllowAnonymousResponses: reqBody.AllowAnonymousResponses,
		AllowMultipleResponses:  reqBody.AllowMultipleResponses,
		SubmitText:              &reqBody.SubmitText,
		CancelText:              &reqBody.CancelText,
	}); err != nil {
		return fiber.NewError(fiber.StatusBadRequest)
	}

	return ctx.Status(fiber.StatusOK).JSON(utils.SendResponse(nil, "Form updated successfully"))
}

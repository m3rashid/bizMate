package forms

import (
	"bizMate/repository"
	"bizMate/utils"

	"github.com/gofiber/fiber/v2"
	"github.com/google/uuid"
)

func createNewForm(ctx *fiber.Ctx) error {
	userId, workspaceId := utils.GetUserAndWorkspaceIdsOrZero(ctx)
	if userId == uuid.Nil || workspaceId == uuid.Nil {
		return fiber.NewError(fiber.StatusBadRequest, "User or Workspace not present")
	}

	reqBody := CreateFormReqBody{}
	if err := utils.ParseBodyAndValidate(ctx, &reqBody); err != nil {
		go utils.LogError(userId, workspaceId, create_form_bad_request, utils.LogDataType{"error": err.Error()})
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
		go utils.LogError(userId, workspaceId, create_form_fail, utils.LogDataType{"error": err.Error()})
		return fiber.NewError(fiber.StatusInternalServerError)
	}

	go utils.LogInfo(userId, workspaceId, create_form_success, utils.LogDataType{"id": id, "title": reqBody.Title})
	return ctx.Status(fiber.StatusOK).JSON(utils.SendResponse(id, "Form Created Successfully"))
}

func paginateForms(ctx *fiber.Ctx) error {
	userId, workspaceId := utils.GetUserAndWorkspaceIdsOrZero(ctx)
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
		go utils.LogError(userId, workspaceId, paginate_forms_fail, utils.LogDataType{"error": err.Error()})
		return fiber.NewError(fiber.StatusInternalServerError)
	}

	paginationRes.Docs = forms
	formsCount, err := queries.GetFormsCount(ctx.Context(), workspaceId)
	if err != nil {
		go utils.LogError(userId, workspaceId, paginate_forms_fail, utils.LogDataType{"error": err.Error()})
		return fiber.NewError(fiber.StatusInternalServerError)
	}

	paginationRes.TotalDocs = formsCount
	paginationRes.BuildPaginationResponse()
	go utils.LogInfo(userId, workspaceId, paginate_forms_success, utils.LogDataType{"count": formsCount})
	return ctx.Status(fiber.StatusOK).JSON(utils.SendResponse(paginationRes, "Got forms successfully"))
}

func getOneForm(ctx *fiber.Ctx) error {
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
	form, err := queries.GetFormById(ctx.Context(), formId)
	if err != nil {
		go utils.LogError(uuid.Nil, uuid.Nil, form_not_found_by_id, utils.LogDataType{"error": err.Error()})
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
		go utils.LogError(userId, workspaceId, update_form_bad_request, utils.LogDataType{"error": err.Error()})
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
		go utils.LogError(userId, workspaceId, update_form_fail, utils.LogDataType{"error": err.Error()})
		return fiber.NewError(fiber.StatusBadRequest)
	}

	go utils.LogError(userId, workspaceId, update_form_success, utils.LogDataType{"id": reqBody.ID})
	return ctx.Status(fiber.StatusOK).JSON(utils.SendResponse(reqBody.ID, "Form updated successfully"))
}

func deleteFormById(ctx *fiber.Ctx) error {
	userId, workspaceId := utils.GetUserAndWorkspaceIdsOrZero(ctx)
	if userId == uuid.Nil || workspaceId == uuid.Nil {
		return fiber.NewError(fiber.StatusBadRequest, "User or Workspace not present")
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
	if err = queries.DeleteForm(ctx.Context(), formId); err != nil {
		go utils.LogError(userId, workspaceId, delete_form_fail, utils.LogDataType{"error": err.Error(), "id": formId})
		return fiber.NewError(fiber.StatusInternalServerError)
	}

	go utils.LogInfo(userId, workspaceId, delete_form_success, utils.LogDataType{"id": formId})
	return ctx.Status(fiber.StatusOK).JSON(utils.SendResponse(formId, "Form deleted successfully"))
}

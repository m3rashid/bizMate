package forms

import (
	"bizMate/repository"
	"bizMate/utils"

	"github.com/gofiber/fiber/v2"
	"github.com/google/uuid"
)

type formResponseReqBody struct {
	Responses map[string]interface{} `json:"response" validate:"required"`
}

func submitFormResponse(ctx *fiber.Ctx) error {
	formId := ctx.Params("formId")
	formUid, err := utils.StringToUuid(formId)
	if err != nil {
		return fiber.NewError(fiber.StatusBadRequest, err.Error())
	}

	reqBody := formResponseReqBody{}
	if err := utils.ParseBodyAndValidate(ctx, &reqBody); err != nil || formId == "" {
		return fiber.NewError(fiber.StatusBadRequest, err.Error())
	}

	deviceIp := utils.GetDeviceIP(ctx)
	userId, _ := utils.GetUserAndWorkspaceIdsOrZero(ctx)

	pgConn, err := utils.GetPostgresDB()
	if err != nil {
		return fiber.NewError(fiber.StatusInternalServerError)
	}
	queries := repository.New(pgConn)

	form, err := queries.GetFormById(ctx.Context(), formUid)
	if err != nil {
		return ctx.SendStatus(fiber.StatusInternalServerError)
	}

	if form.ID == uuid.Nil {
		return ctx.SendStatus(fiber.StatusInternalServerError)
	}

	if !*form.Active {
		return fiber.NewError(fiber.StatusTooEarly, "form is not active")
	}

	if !*form.AllowAnonymousResponses && userId == uuid.Nil {
		return fiber.NewError(fiber.StatusUnauthorized, "unauthorized")
	}

	mongoDb, err := utils.GetMongoDB()
	if err != nil {
		return fiber.NewError(fiber.StatusInternalServerError)
	}

	// TODO: validate reqBody with form Body

	formResponse := repository.CreateFormResponseParams{
		FormID:      form.ID,
		WorkspaceID: form.WorkspaceID,
		CreatedByID: userId,
		DeviceIp:    &deviceIp,
		Response:    reqBody.Responses,
	}

	createResponseRes, err := repository.CreateFormResponse(ctx.Context(), mongoDb, formResponse)
	if err != nil {
		return fiber.NewError(fiber.StatusInternalServerError, "Could not save response")
	}

	return ctx.Status(fiber.StatusCreated).JSON(utils.SendResponse(createResponseRes.InsertedID, "Response submitted successfully"))
}

func getFormResponseCount(ctx *fiber.Ctx) error {
	_formId := ctx.Params("formId")
	formId, err := utils.StringToUuid(_formId)
	if err != nil {
		return fiber.NewError(fiber.StatusBadRequest)
	}

	_, workspaceId := utils.GetUserAndWorkspaceIdsOrZero(ctx)
	mongoDb, err := utils.GetMongoDB()
	if err != nil {
		return fiber.NewError(fiber.StatusInternalServerError)
	}

	formResponsesCount, err := repository.GetFormResponsesCount(ctx.Context(), mongoDb, repository.GetFormResponsesCountParams{
		FormID:      formId,
		WorkspaceID: workspaceId,
	})
	if err != nil {
		return fiber.NewError(fiber.StatusInternalServerError)
	}

	return ctx.Status(fiber.StatusOK).JSON(utils.SendResponse(formResponsesCount, "Response count fetched successfully"))
}

func getFormResponseAnalysis(ctx *fiber.Ctx) error {
	_formId := ctx.Params("formId")
	if _formId == "" {
		return fiber.NewError(fiber.StatusBadRequest, "Invalid form id")
	}

	formId, err := utils.StringToUuid(_formId)
	if err != nil || formId == uuid.Nil {
		return fiber.NewError(fiber.StatusBadRequest, "Invalid form id")
	}

	pgConn, err := utils.GetPostgresDB()
	if err != nil {
		return fiber.NewError(fiber.StatusInternalServerError)
	}

	query := repository.New(pgConn)
	form, err := query.GetFormById(ctx.Context(), formId)
	if err != nil {
		return fiber.NewError(fiber.StatusInternalServerError)
	}

	if *form.Active {
		return fiber.NewError(fiber.StatusTooEarly, "Form is active now, analysis is available once the form is inactive/complete its duration")
	}

	mongoDb, err := utils.GetMongoDB()
	if err != nil {
		return fiber.NewError(fiber.StatusInternalServerError)
	}

	formResponses, err := repository.GetAllFormResponses(ctx.Context(), mongoDb, repository.GetAllFormResponsesParams{
		FormID:      formId,
		WorkspaceID: form.WorkspaceID,
	})
	if err != nil {
		return fiber.NewError(fiber.StatusInternalServerError)
	}

	formAnalysis, err := analyzeForm(&form, &formResponses)
	if err != nil {
		return fiber.NewError(fiber.StatusInternalServerError)
	}

	return ctx.Status(fiber.StatusOK).JSON(
		utils.SendResponse(fiber.Map{"title": form.Title, "description": form.Description, "analysis": formAnalysis}, "Form analysis fetched successfully"),
	)
}

func paginateFormResponses(ctx *fiber.Ctx) error {
	_formId := ctx.Params("formId")
	formId, err := utils.StringToUuid(_formId)
	if err != nil {
		return fiber.NewError(fiber.StatusBadRequest)
	}

	_, workspaceId := utils.GetUserAndWorkspaceIdsOrZero(ctx)
	if workspaceId == uuid.Nil {
		return fiber.NewError(fiber.StatusBadRequest, "Unknown workspace")
	}

	paginationRes := utils.PaginationResponse[repository.FormResponse]{}
	if err := paginationRes.ParseQuery(ctx, 50); err != nil {
		return fiber.NewError(fiber.StatusBadRequest, "Incorrect Parameters")
	}

	mongoConn, err := utils.GetMongoDB()
	if err != nil {
		return fiber.NewError(fiber.StatusInternalServerError)
	}

	formResponses, err := repository.PaginateFormResponses(ctx.Context(), mongoConn, repository.PaginateFormResponsesParams{
		WorkspaceID: workspaceId,
		FormID:      formId,
		Limit:       int64(paginationRes.Limit),
		Offset:      int64((paginationRes.CurrentPage - 1) * paginationRes.Limit),
	})
	if err != nil {
		return fiber.NewError(fiber.StatusInternalServerError)
	}
	paginationRes.Docs = formResponses

	formResponsesCount, err := repository.GetFormResponsesCount(ctx.Context(), mongoConn, repository.GetFormResponsesCountParams{
		FormID:      formId,
		WorkspaceID: workspaceId,
	})
	if err != nil {
		return fiber.NewError(fiber.StatusInternalServerError)
	}

	paginationRes.TotalDocs = formResponsesCount
	paginationRes.BuildPaginationResponse()

	return ctx.Status(fiber.StatusOK).JSON(utils.SendResponse(paginationRes, "Got form responses successfully"))
}

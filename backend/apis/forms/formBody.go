package forms

import (
	"bizMate/repository"
	"bizMate/utils"
	"encoding/json"

	"github.com/gofiber/fiber/v2"
	"github.com/google/uuid"
)

type FormBodyReqBody struct {
	FormBody repository.FormBody `json:"meta" validate:"required"`
}

func updateFormBody(ctx *fiber.Ctx) error {
	userId, workspaceId := utils.GetUserAndWorkspaceIdsOrZero(ctx)
	if userId == uuid.Nil || workspaceId == uuid.Nil {
		return fiber.NewError(fiber.StatusBadRequest, "User or Workspace not present")
	}

	_formId := ctx.Params("formId")
	formUuid, err := utils.StringToUuid(_formId)
	if err != nil || formUuid == uuid.Nil {
		return fiber.NewError(fiber.StatusBadRequest, "Invalid form id")
	}

	reqBody := FormBodyReqBody{}
	if err := utils.ParseBodyAndValidate(ctx, &reqBody); err != nil {
		return fiber.NewError(fiber.StatusBadRequest, err.Error())
	}

	if len(reqBody.FormBody) == 0 {
		return fiber.NewError(fiber.StatusBadRequest)
	}

	pgConn, err := utils.GetPostgresDB()
	if err != nil {
		return fiber.NewError(fiber.StatusInternalServerError)
	}

	queries := repository.New(pgConn)
	form, err := queries.GetFormById(ctx.Context(), repository.GetFormByIdParams{WorkspaceID: workspaceId, ID: formUuid})
	if err != nil || form.ID == uuid.Nil {
		return fiber.NewError(fiber.StatusBadRequest, "Form not found")
	}

	validationErrors := repository.ValidateFormBodyMeta(reqBody.FormBody)
	if len(validationErrors) > 0 {
		jsonStr, err := json.Marshal(validationErrors)
		if err != nil {
			return fiber.NewError(fiber.StatusInternalServerError)
		}
		return fiber.NewError(fiber.StatusBadRequest, string(jsonStr))
	}

	if err = queries.UpdateFormBody(ctx.Context(), repository.UpdateFormBodyParams{ID: form.ID, FormBody: reqBody.FormBody}); err != nil {
		return fiber.NewError(fiber.StatusInternalServerError, err.Error())
	}

	return ctx.Status(fiber.StatusOK).JSON(utils.SendResponse(nil, "Form Body created successfully"))
}

package forms

import (
	"bizMate/repository"
	"bizMate/utils"
	"encoding/json"

	"github.com/gofiber/fiber/v2"
	"github.com/google/uuid"
)

func updateFormBody(ctx *fiber.Ctx) error {
	userId, workspaceId := utils.GetUserAndWorkspaceIdsOrZero(ctx)
	userEmail := utils.GetUserEmailFromCtx(ctx)
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
		go utils.LogError(update_form_body_fail, userEmail, workspaceId, repository.FormObjectType, utils.LogData{"error": err.Error()})
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
	form, err := queries.GetFormById(ctx.Context(), formUuid)
	if err != nil || form.ID == uuid.Nil {
		go utils.LogError(update_form_body_fail, userEmail, workspaceId, repository.FormObjectType, utils.LogData{"error": err.Error()})
		return fiber.NewError(fiber.StatusBadRequest, "Form not found")
	}

	validationErrors := repository.ValidateFormBodyMeta(reqBody.FormBody)
	if len(validationErrors) > 0 {
		jsonStr, err := json.Marshal(validationErrors)
		go utils.LogError(update_form_body_fail, userEmail, workspaceId, repository.FormObjectType, utils.LogData{"error": string(jsonStr)})

		if err != nil {
			return fiber.NewError(fiber.StatusInternalServerError)
		}
		return fiber.NewError(fiber.StatusBadRequest, string(jsonStr))
	}

	if err = queries.UpdateFormBody(ctx.Context(), repository.UpdateFormBodyParams{ID: form.ID, FormBody: reqBody.FormBody}); err != nil {
		go utils.LogError(update_form_body_fail, userEmail, workspaceId, repository.FormObjectType, utils.LogData{"error": err.Error(), "form_id": form.ID.String()})
		return fiber.NewError(fiber.StatusInternalServerError, err.Error())
	}

	go utils.LogError(update_form_body_success, userEmail, workspaceId, repository.FormObjectType, utils.LogData{"form_id": form.ID.String()})
	return ctx.Status(fiber.StatusOK).JSON(utils.SendResponse(nil, "Form Body created successfully"))
}

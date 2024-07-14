package forms

import (
	"bizMate/repository"
	"bizMate/utils"
	"encoding/json"

	"github.com/gofiber/fiber/v2"
	"github.com/google/uuid"
)

type newFormInnerBodyReqBody struct {
	Meta         []repository.FormElementInstanceType `json:"meta" validate:"required"`
	NextText     string                               `json:"next_text" validate:"required,alphanum"`
	PreviousText string                               `json:"previous_text" validate:"required,alphanum"`
}

func createNewFormInnerBody(ctx *fiber.Ctx) error {
	userId, workspaceId := utils.GetUserAndWorkspaceIdsOrZero(ctx)
	if userId == uuid.Nil || workspaceId == uuid.Nil {
		return fiber.NewError(fiber.StatusBadRequest, "User or Workspace not present")
	}

	_formId := ctx.Params("formId")
	formUuid, err := utils.StringToUuid(_formId)
	if err != nil || formUuid == uuid.Nil {
		return fiber.NewError(fiber.StatusBadRequest, "Invalid form id")
	}

	reqBody := newFormInnerBodyReqBody{}
	if err := utils.ParseBodyAndValidate(ctx, &reqBody); err != nil {
		return fiber.NewError(fiber.StatusBadRequest, err.Error())
	}

	if reqBody.Meta == nil || len(reqBody.Meta) == 0 || reqBody.NextText == "" || reqBody.PreviousText == "" {
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

	validationErrors := repository.ValidateFormBodyMeta(reqBody.Meta)
	if len(validationErrors) > 0 {
		jsonStr, err := json.Marshal(validationErrors)
		if err != nil {
			return fiber.NewError(fiber.StatusInternalServerError)
		}
		return fiber.NewError(fiber.StatusBadRequest, string(jsonStr))
	}

	newFormBody := form.FormBody
	newFormBody = append(newFormBody, repository.FormBodyMeta{
		Meta:         reqBody.Meta,
		NextText:     reqBody.NextText,
		PreviousText: reqBody.PreviousText,
	})

	if err = queries.UpdateFormBody(ctx.Context(), repository.UpdateFormBodyParams{ID: form.ID, FormBody: newFormBody}); err != nil {
		return fiber.NewError(fiber.StatusInternalServerError, err.Error())
	}

	return ctx.Status(fiber.StatusOK).JSON(utils.SendResponse(nil, "Form Body created successfully"))
}

// func getFormBodyById(ctx *fiber.Ctx) error {
// 	formBodyId := ctx.Params("formBodyId")
// 	if formBodyId == "" {
// 		return fiber.NewError(fiber.StatusBadRequest)
// 	}

// 	mongoDb, err := utils.GetMongoDB()
// 	if err != nil {
// 		return fiber.NewError(fiber.StatusInternalServerError)
// 	}

// 	formBody := repository.FormBodyDocument{}
// 	err = mongoDb.Collection(repository.FORM_BODY_COLLECTION_NAME).FindOne(ctx.Context(), bson.D{
// 		primitive.E{Key: "_id", Value: formBodyId},
// 	}).Decode(&formBody)
// 	if err != nil {
// 		return fiber.NewError(fiber.StatusBadRequest, "Form Body not found")
// 	}

// 	fmt.Printf("res: %+v\n", formBody)
// 	return ctx.Status(fiber.StatusOK).JSON(utils.SendResponse(formBody, "Form Fetched successfully"))
// }

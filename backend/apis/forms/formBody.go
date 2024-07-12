package forms

import (
	"bizMate/repository"
	"bizMate/utils"
	"encoding/json"
	"fmt"

	"github.com/gofiber/fiber/v2"
	"github.com/google/uuid"
	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/bson/primitive"
)

type newFormInnerBodyReqBody struct {
	Meta       []repository.FormElementInstanceType `json:"meta"`
	SubmitText string                               `json:"submit_text"`
	CancelText string                               `json:"cancel_text"`
}

func createNewFormInnerBody(ctx *fiber.Ctx) error {
	userId, workspaceId := utils.GetUserAndWorkspaceIdsOrZero(ctx)
	if userId == uuid.Nil || workspaceId == uuid.Nil {
		return fiber.NewError(fiber.StatusBadRequest, "User or Workspace not present")
	}

	_formId := ctx.Params("formId")
	if _formId == "" {
		return fiber.NewError(fiber.StatusBadRequest)
	}

	formUid, err := utils.StringToUuid(_formId)
	if err != nil {
		return fiber.NewError(fiber.StatusBadRequest, "Invalid form id")
	}

	pgConn, err := utils.GetPostgresDB()
	if err != nil {
		return fiber.NewError(fiber.StatusInternalServerError)
	}

	queries := repository.New(pgConn)
	form, err := queries.GetFormById(ctx.Context(), repository.GetFormByIdParams{
		WorkspaceID: workspaceId,
		ID:          formUid,
	})

	if err != nil {
		return fiber.NewError(fiber.StatusBadRequest, "Form not found")
	}

	if form.ID == uuid.Nil {
		return fiber.NewError(fiber.StatusBadRequest, "Form not found")
	}

	formBodyObjectId, err := utils.StringToObjectID(form.FormBodyID)
	if err != nil {
		return fiber.NewError(fiber.StatusBadRequest, "Form not found")
	}

	reqBody := newFormInnerBodyReqBody{}
	if err := utils.ParseBodyAndValidate(ctx, &reqBody); err != nil {
		return fiber.NewError(fiber.StatusBadRequest, err.Error())
	}

	validationErrors := repository.ValidateFormBodyMeta(reqBody.Meta)
	if len(validationErrors) > 0 {
		jsonStr, err := json.Marshal(validationErrors)
		if err != nil {
			return fiber.NewError(fiber.StatusInternalServerError)
		}
		return fiber.NewError(fiber.StatusBadRequest, string(jsonStr))
	}

	mongoDb, err := utils.GetMongoDB()
	if err != nil {
		return fiber.NewError(fiber.StatusInternalServerError)
	}

	if err = repository.InsertFormInnerBodyInSameFormBody(mongoDb, ctx.Context(), formBodyObjectId, repository.FormInnerBody{
		CreatedByID: userId,
		Meta:        reqBody.Meta,
		SubmitText:  reqBody.SubmitText,
		CancelText:  reqBody.CancelText,
	}); err != nil {
		return fiber.NewError(fiber.StatusInternalServerError)
	}

	return ctx.Status(fiber.StatusOK).JSON(utils.SendResponse(nil, "Form Body created successfully"))
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

	formBody := repository.FormBodyDocument{}
	err = mongoDb.Collection(repository.FORM_BODY_COLLECTION_NAME).FindOne(ctx.Context(), bson.D{
		primitive.E{Key: "_id", Value: formBodyId},
	}).Decode(&formBody)
	if err != nil {
		return fiber.NewError(fiber.StatusBadRequest, "Form Body not found")
	}

	fmt.Printf("res: %+v\n", formBody)
	return ctx.Status(fiber.StatusOK).JSON(utils.SendResponse(formBody, "Form Fetched successfully"))
}

package forms

import (
	"bizMate/repository"
	"bizMate/utils"
	"fmt"

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

	// formResponseJson, err := json.Marshal(reqBody.Responses)
	// if err != nil {
	// 	return fiber.NewError(fiber.StatusBadRequest, "Could not save form response")
	// }

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

	if err := queries.CreateFormResponse(ctx.Context(), repository.CreateFormResponseParams{
		FormID:      form.ID,
		WorkspaceID: form.WorkspaceID,
		CreatedByID: utils.ToPgTypeUUID(userId),
		DeviceIp:    &deviceIp,
		Response:    reqBody.Responses,
	}); err != nil {
		return fiber.NewError(fiber.StatusInternalServerError, "Could not save response")
	}

	return ctx.Status(fiber.StatusCreated).JSON(utils.SendResponse(nil, "Response submitted successfully"))

	// mongoDb, err := utils.GetMongoDB()
	// if err != nil {
	// 	return fiber.NewError(fiber.StatusInternalServerError)
	// }

	// formBodyOid, err := utils.StringToObjectID(form.FormBodyID)
	// if err != nil {
	// 	return fiber.NewError(fiber.StatusInternalServerError)
	// }

	// formBody := repository.FormBodyDocument{}
	// if err := mongoDb.Collection(repository.FORM_BODY_COLLECTION_NAME).FindOne(ctx.Context(), bson.D{
	// 	primitive.E{Key: "_id", Value: formBodyOid},
	// }).Decode(&formBody); err != nil {
	// 	return fiber.NewError(fiber.StatusNotFound, "form not found")
	// }

	// validate reqBody with form Body
	// if len(reqBody.Responses) != len(formBody.FormInnerBody) {
	// 	return fiber.NewError(fiber.StatusBadRequest, "invalid request body")
	// }

	// validate required fields in form body
	// formResponse := repository.FormResponseDocument{
	// 	ID:          primitive.NewObjectID(),
	// 	WorkspaceID: workspaceId,
	// 	FormID:      form.ID,
	// 	CreatedAt:   time.Now(),
	// 	CreatedByID: userId,
	// 	DeviceIP:    utils.GetDeviceIP(ctx),
	// 	Responses:   reqBody.Responses,
	// }

	// res, err := mongoDb.Collection(repository.FORM_RESPONSES_MODEL_NAME).InsertOne(ctx.Context(), formResponse)
	// if err != nil {
	// 	return fiber.NewError(fiber.StatusInternalServerError, err.Error())
	// }

	// if toCreateNewBody {
	// 	newFormInnerResponse := make([]repository.FormResponseBody, len(formBody.FormInnerBody))

	// 	res, err := mongoDb.Collection(repository.FORM_RESPONSE_COLLECTION_NAME).InsertOne(ctx.Context(), repository.FormResponseDocument{
	// 		WorkspaceID: workspaceId,
	// 		FormID:      form.ID,
	// 		Responses:   newFormInnerResponse,
	// 	})
	// 	if err != nil {
	// 		return fiber.NewError(fiber.StatusInternalServerError)
	// 	}

	// 	if err := mongoDb.Collection(repository.FORM_RESPONSE_COLLECTION_NAME).FindOne(ctx.Context(), bson.D{
	// 		primitive.E{Key: "_id", Value: res.InsertedID},
	// 	}).Decode(&formResponse); err != nil {
	// 		return fiber.NewError(fiber.StatusInternalServerError)
	// 	}
	// }

	// formResponseBodyArr := formResponse.Responses

	// res := repository.FormResponseBody{
	// 	CreatedAt:   time.Now(),
	// 	CreatedByID: userId,
	// 	DeviceIP:    utils.GetDeviceIP(ctx),
	// 	Response:    reqBody.Response,
	// }

	// formResponseBodyArr[*reqBody.PageNumber] = res
	// if _, err := mongoDb.Collection(repository.FORM_RESPONSE_COLLECTION_NAME).UpdateOne(ctx.Context(), bson.D{
	// 	primitive.E{Key: "_id", Value: formResponse.ID},
	// }, bson.D{
	// 	primitive.E{Key: "$set", Value: bson.D{
	// 		primitive.E{Key: "responses", Value: formResponseBodyArr},
	// 	}},
	// }); err != nil {
	// 	return fiber.NewError(fiber.StatusInternalServerError)
	// }
}

func editFormResponse(ctx *fiber.Ctx) error {
	reqBody := formResponseReqBody{}
	formId := ctx.Params("formId")
	// userId, _ := utils.GetUserAndWorkspaceIdsOrZero(ctx)

	if err := utils.ParseBodyAndValidate(ctx, &reqBody); err != nil || formId == "" {
		return fiber.NewError(fiber.StatusBadRequest, "Bad Request")
	}

	// if reqBody.ID == "" {
	// 	return fiber.NewError(fiber.StatusBadRequest, "Bad Request")
	// }

	// db, err := utils.GetPostgresDB()
	// if err != nil {
	// 	return fiber.NewError(fiber.StatusInternalServerError)
	// }

	// form := models.Form{}
	// if err := db.Where("id = ?", formId).First(&form).Error; err != nil {
	// 	return fiber.NewError(fiber.StatusInternalServerError)
	// }

	// if !form.Active {
	// 	return fiber.NewError(fiber.StatusUnauthorized, "form_inactive")
	// }

	// if !form.AllowResponseUpdate {
	// 	return fiber.NewError(fiber.StatusUnauthorized, "response updated not allowed")
	// }

	// formResponse := models.FormResponse{}
	// if err := db.Where("id = ?", reqBody.ID).First(&formResponse).Error; err != nil {
	// 	return fiber.NewError(fiber.StatusInternalServerError)
	// }

	// userIdStr := userId.String()
	// if *formResponse.CreatedByID == "" || formResponse.CreatedByID != &userIdStr {
	// 	return fiber.NewError(fiber.StatusUnauthorized, "invalid form response")
	// }

	// formResponse.DeviceIP = utils.GetDeviceIP(ctx)
	// formResponse.Response = reqBody.Response
	// formResponse.UpdatedBy = models.UpdatedBy{UpdatedByID: &userIdStr}

	return ctx.Status(fiber.StatusCreated).JSON(utils.SendResponse(nil, "Response updated successfully"))
}

func getFormResponseCount(ctx *fiber.Ctx) error {
	// formId := ctx.Params("formId")

	// db, err := utils.GetPostgresDB()
	// if err != nil {
	// 	return fiber.NewError(fiber.StatusInternalServerError)
	// }

	// var responseCount int64
	// if err := db.Model(models.FormResponse{}).Where("\"formId\" = ?", formId).Count(&responseCount).Error; err != nil {
	// 	return fiber.NewError(fiber.StatusInternalServerError)
	// }

	return ctx.Status(fiber.StatusOK).JSON(utils.SendResponse(nil, "Response count fetched successfully"))
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

	formResponses, err := query.GetFormResponseByFormId(ctx.Context(), repository.GetFormResponseByFormIdParams{FormID: formId})
	if err != nil {
		return fiber.NewError(fiber.StatusInternalServerError)
	}

	fmt.Println("FORM", form)

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

	paginationRes := utils.PaginationResponse[repository.PaginateFormResponsesRow]{}
	if err := paginationRes.ParseQuery(ctx, 50); err != nil {
		return fiber.NewError(fiber.StatusBadRequest, "Incorrect Parameters")
	}

	pgConn, err := utils.GetPostgresDB()
	if err != nil {
		return fiber.NewError(fiber.StatusInternalServerError)
	}

	queries := repository.New(pgConn)

	formResponses, err := queries.PaginateFormResponses(ctx.Context(), repository.PaginateFormResponsesParams{
		FormID:      formId,
		WorkspaceID: workspaceId,
		Limit:       paginationRes.Limit,
		Offset:      (paginationRes.CurrentPage - 1) * paginationRes.Limit,
	})
	if err != nil {
		return fiber.NewError(fiber.StatusInternalServerError)
	}
	paginationRes.Docs = formResponses

	formResponsesCount, err := queries.GetFormResponsesCount(ctx.Context(), repository.GetFormResponsesCountParams{
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

package forms

import (
	"bizMate/repository"
	"bizMate/utils"
	"time"

	"github.com/gofiber/fiber/v2"
	"github.com/google/uuid"
	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/bson/primitive"
	"go.mongodb.org/mongo-driver/mongo"
)

type formResponseReqBody struct {
	Response       map[string]interface{} `json:"response" validate:"required"`
	PageNumber     *int32                 `json:"pageNumber" validate:"required"`
	FormBodyID     primitive.ObjectID     `json:"formBodyId" validate:"required"`
	FormResponseID primitive.ObjectID     `json:"formResponseId"`
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

	pgConn, err := utils.GetPostgresDB()
	if err != nil {
		return fiber.NewError(fiber.StatusInternalServerError)
	}

	queries := repository.New(pgConn)
	userId, workspaceId := utils.GetUserAndWorkspaceIdsOrZero(ctx)
	form, err := queries.GetFormById(ctx.Context(), repository.GetFormByIdParams{ID: formUid, WorkspaceID: workspaceId})
	if err != nil {
		return ctx.SendStatus(fiber.StatusInternalServerError)
	}

	if form.ID == uuid.Nil {
		return ctx.SendStatus(fiber.StatusInternalServerError)
	}

	if !*form.Active {
		return fiber.NewError(fiber.StatusTooEarly, "form is not active")
	}

	if !*form.AllowAnonymousResponse && userId == uuid.Nil {
		return fiber.NewError(fiber.StatusUnauthorized, "unauthorized")
	}

	mongoDb, err := utils.GetMongoDB()
	if err != nil {
		return fiber.NewError(fiber.StatusInternalServerError)
	}

	formBodyOid, err := utils.StringToObjectID(form.FormBodyID)
	if err != nil {
		return fiber.NewError(fiber.StatusInternalServerError)
	}

	formBody := repository.FormBodyDocument{}
	if err := mongoDb.Collection(repository.FORM_BODY_COLLECTION_NAME).FindOne(ctx.Context(), bson.D{
		primitive.E{Key: "_id", Value: formBodyOid},
	}).Decode(&formBody); err != nil {
		return fiber.NewError(fiber.StatusNotFound, "form not found")
	}

	toCreateNewBody := false
	formResponse := repository.FormResponseDocument{}

	if reqBody.FormResponseID == primitive.NilObjectID {
		toCreateNewBody = true
	} else {
		if err := mongoDb.Collection(repository.FORM_RESPONSE_COLLECTION_NAME).FindOne(ctx.Context(), bson.D{
			primitive.E{Key: "", Value: reqBody.FormResponseID},
		}).Decode(&formResponse); err != nil {
			if err == mongo.ErrNoDocuments {
				toCreateNewBody = true
			} else {
				return fiber.NewError(fiber.StatusInternalServerError)
			}
		}
	}

	if toCreateNewBody {
		newFormInnerResponse := make([]repository.FormResponseBody, len(formBody.FormInnerBody))

		res, err := mongoDb.Collection(repository.FORM_RESPONSE_COLLECTION_NAME).InsertOne(ctx.Context(), repository.FormResponseDocument{
			WorkspaceID: workspaceId,
			FormID:      form.ID,
			Responses:   newFormInnerResponse,
		})
		if err != nil {
			return fiber.NewError(fiber.StatusInternalServerError)
		}

		if err := mongoDb.Collection(repository.FORM_RESPONSE_COLLECTION_NAME).FindOne(ctx.Context(), bson.D{
			primitive.E{Key: "_id", Value: res.InsertedID},
		}).Decode(&formResponse); err != nil {
			return fiber.NewError(fiber.StatusInternalServerError)
		}
	}

	formResponseBodyArr := formResponse.Responses

	res := repository.FormResponseBody{
		CreatedAt:   time.Now(),
		CreatedByID: userId,
		DeviceIP:    utils.GetDeviceIP(ctx),
		Response:    reqBody.Response,
	}

	formResponseBodyArr[*reqBody.PageNumber] = res
	if _, err := mongoDb.Collection(repository.FORM_RESPONSE_COLLECTION_NAME).UpdateOne(ctx.Context(), bson.D{
		primitive.E{Key: "_id", Value: formResponse.ID},
	}, bson.D{
		primitive.E{Key: "$set", Value: bson.D{
			primitive.E{Key: "responses", Value: formResponseBodyArr},
		}},
	}); err != nil {
		return fiber.NewError(fiber.StatusInternalServerError)
	}

	return ctx.Status(fiber.StatusCreated).JSON(utils.SendResponse(nil, "Response submitted successfully"))
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
	// formId := ctx.Params("formId")

	// db, err := utils.GetPostgresDB()
	// if err != nil {
	// 	return fiber.NewError(fiber.StatusInternalServerError)
	// }

	// form := models.Form{}
	// if err := db.Where("id = ?", formId).First(&form).Error; err != nil {
	// 	return fiber.NewError(fiber.StatusInternalServerError)
	// }

	// if form.Active {
	// 	return fiber.NewError(fiber.StatusTooEarly, "Form is active now, analysis is available once the form is inactive/complete its duration")
	// }

	// formResponseRes := []models.FormResponse{}
	// if err := db.Where("\"formId\" = ?", formId).Find(&formResponseRes).Error; err != nil {
	// 	return fiber.NewError(fiber.StatusInternalServerError)
	// }

	// formAnalysis, err := analyzeForm(&form, &formResponseRes)
	// if err != nil {
	// 	return fiber.NewError(fiber.StatusInternalServerError)
	// }

	// return ctx.Status(fiber.StatusOK).JSON(
	// 	utils.SendResponse(fiber.Map{"title": form.Title, "description": form.Description, "analysis": formAnalysis}, "Form analysis fetched successfully"),
	// )
	return ctx.Status(fiber.StatusOK).JSON(utils.SendResponse(nil, ""))
}

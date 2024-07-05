package forms

import (
	"bizMate/models"
	"bizMate/utils"

	"github.com/gofiber/fiber/v2"
	"github.com/google/uuid"
)

type formResponseReqBody struct {
	ID       string `json:"id"`
	Response string `json:"response" validate:"required"`
}

func submitFormResponse(ctx *fiber.Ctx) error {
	reqBody := formResponseReqBody{}
	formId := ctx.Params("formId")

	if err := utils.ParseBodyAndValidate(ctx, &reqBody); err != nil || formId == "" {
		return ctx.Status(fiber.StatusBadRequest).JSON(err.Error())
	}

	db, err := utils.GetPostgresDB()
	if err != nil {
		return ctx.SendStatus(fiber.StatusInternalServerError)
	}

	form := models.Form{}
	if err := db.Where("id = ?", formId).First(&form).Error; err != nil {
		return ctx.SendStatus(fiber.StatusInternalServerError)
	}

	if !form.Active {
		return ctx.Status(fiber.StatusTooEarly).JSON("form_inactive")
	}

	userId, _ := utils.GetUserAndWorkspaceIdsOrZero(ctx)
	if !form.AllowAnonymousResponse && userId == uuid.Nil {
		return ctx.Status(fiber.StatusUnauthorized).JSON("unauthorized")
	}

	userIdStr := userId.String()
	formResponse := models.FormResponse{
		FormID:                 form.ID,
		Response:               reqBody.Response,
		DeviceIP:               utils.GetDeviceIP(ctx),
		BaseModelWithWorkspace: models.BaseModelWithWorkspace{WorkspaceID: form.WorkspaceID},
		OptionalCreatedBy:      utils.Ternary(userIdStr != "", models.OptionalCreatedBy{CreatedByID: &userIdStr}, models.OptionalCreatedBy{}),
	}

	if err := db.Create(&formResponse).Error; err != nil {
		return ctx.SendStatus(fiber.StatusInternalServerError)
	}

	if form.SendResponseEmail {
		sendResponseEmail(form, formResponse, userId.String(), db)
	}

	return ctx.Status(fiber.StatusCreated).JSON(fiber.Map{"message": "response_submitted"})
}

func editFormResponse(ctx *fiber.Ctx) error {
	reqBody := formResponseReqBody{}
	formId := ctx.Params("formId")
	userId, _ := utils.GetUserAndWorkspaceIdsOrZero(ctx)

	if err := utils.ParseBodyAndValidate(ctx, &reqBody); err != nil || formId == "" {
		return ctx.Status(fiber.StatusBadRequest).JSON("Bad Request")
	}

	if reqBody.ID == "" {
		return ctx.Status(fiber.StatusBadRequest).JSON("Bad Request")
	}

	db, err := utils.GetPostgresDB()
	if err != nil {
		return ctx.SendStatus(fiber.StatusInternalServerError)
	}

	form := models.Form{}
	if err := db.Where("id = ?", formId).First(&form).Error; err != nil {
		return ctx.SendStatus(fiber.StatusInternalServerError)
	}

	if !form.Active {
		return ctx.Status(fiber.StatusUnauthorized).JSON("form_inactive")
	}

	if !form.AllowResponseUpdate {
		return ctx.Status(fiber.StatusUnauthorized).JSON("response updated not allowed")
	}

	formResponse := models.FormResponse{}
	if err := db.Where("id = ?", reqBody.ID).First(&formResponse).Error; err != nil {
		return ctx.SendStatus(fiber.StatusInternalServerError)
	}

	userIdStr := userId.String()
	if *formResponse.CreatedByID == "" || formResponse.CreatedByID != &userIdStr {
		return ctx.Status(fiber.StatusUnauthorized).JSON("invalid form response")
	}

	formResponse.DeviceIP = utils.GetDeviceIP(ctx)
	formResponse.Response = reqBody.Response
	formResponse.UpdatedBy = models.UpdatedBy{UpdatedByID: &userIdStr}

	return ctx.Status(fiber.StatusCreated).JSON(fiber.Map{"message": "response_submitted"})
}

func getFormResponseCount(ctx *fiber.Ctx) error {
	formId := ctx.Params("formId")

	db, err := utils.GetPostgresDB()
	if err != nil {
		return ctx.SendStatus(fiber.StatusInternalServerError)
	}

	var responseCount int64
	if err := db.Model(models.FormResponse{}).Where("\"formId\" = ?", formId).Count(&responseCount).Error; err != nil {
		return ctx.SendStatus(fiber.StatusInternalServerError)
	}

	return ctx.JSON(fiber.Map{"count": responseCount})
}

func getFormResponseAnalysis(ctx *fiber.Ctx) error {
	formId := ctx.Params("formId")

	db, err := utils.GetPostgresDB()
	if err != nil {
		return ctx.SendStatus(fiber.StatusInternalServerError)
	}

	form := models.Form{}
	if err := db.Where("id = ?", formId).First(&form).Error; err != nil {
		return ctx.SendStatus(fiber.StatusInternalServerError)
	}

	if form.Active {
		return ctx.Status(fiber.StatusTooEarly).JSON("Form is active now, analysis is available once the form is inactive/complete its duration")
	}

	formResponseRes := []models.FormResponse{}
	if err := db.Where("\"formId\" = ?", formId).Find(&formResponseRes).Error; err != nil {
		return ctx.SendStatus(fiber.StatusInternalServerError)
	}

	formAnalysis, err := analyzeForm(&form, &formResponseRes)
	if err != nil {
		return ctx.SendStatus(fiber.StatusInternalServerError)
	}

	return ctx.Status(fiber.StatusOK).JSON(fiber.Map{"title": form.Title, "description": form.Description, "analysis": formAnalysis})
}

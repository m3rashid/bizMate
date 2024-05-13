package forms

import (
	"bizmate/models"
	"bizmate/utils"

	"github.com/gofiber/fiber/v2"
)

type formResponseReqBody struct {
	ID       uint   `json:"id" validate:""`
	Response string `json:"response" validate:"required"`
}

func getFormReports(ctx *fiber.Ctx) error {
	return ctx.SendString("Hello, World!")
}

func submitFormResponse(ctx *fiber.Ctx) error {
	reqBody := formResponseReqBody{}
	formId := ctx.Params("formId")

	if err := utils.ParseBodyAndValidate(ctx, &reqBody); err != nil || formId == "" {
		return ctx.Status(fiber.StatusBadRequest).JSON(fiber.Map{"error": err.Error()})
	}

	db, err := utils.GetTenantDbFromCtx(ctx)
	if err != nil {
		return ctx.Status(fiber.StatusInternalServerError).JSON(fiber.Map{"error": "internal_server_error"})
	}

	form := models.Form{}
	if err := db.Where("id = ?", formId).First(&form).Error; err != nil {
		return ctx.Status(fiber.StatusInternalServerError).JSON(fiber.Map{"error": err.Error()})
	}

	if !form.Active {
		return ctx.Status(fiber.StatusTooEarly).JSON(fiber.Map{"error": "form_inactive"})
	}

	userId := utils.GetUserIdOrNullFromCtxMaybe(ctx)
	if !form.AllowAnonymousResponse && userId == 0 {
		return ctx.Status(fiber.StatusUnauthorized).JSON(fiber.Map{"error": "unauthorized"})
	}

	formResponse := models.FormResponse{
		FormID:            form.ID,
		Response:          reqBody.Response,
		DeviceIP:          utils.GetDeviceIP(ctx),
		OptionalCreatedBy: utils.Ternary(userId != 0, models.OptionalCreatedBy{CreatedByID: &userId}, models.OptionalCreatedBy{}),
	}

	if err := db.Create(&formResponse).Error; err != nil {
		return ctx.Status(fiber.StatusInternalServerError).JSON(fiber.Map{"error": err.Error()})
	}

	return ctx.Status(fiber.StatusCreated).JSON(fiber.Map{"message": "response_submitted"})
}

func editFormResponse(ctx *fiber.Ctx) error {
	reqBody := formResponseReqBody{}
	formId := ctx.Params("formId")
	userId := ctx.Locals("userId").(uint)

	if err := utils.ParseBodyAndValidate(ctx, &reqBody); err != nil || formId == "" {
		return ctx.Status(fiber.StatusBadRequest).JSON(fiber.Map{"error": "Bad Request"})
	}

	if reqBody.ID == 0 {
		return ctx.Status(fiber.StatusBadRequest).JSON(fiber.Map{"error": "Bad Request"})
	}

	db, err := utils.GetTenantDbFromCtx(ctx)
	if err != nil {
		return ctx.Status(fiber.StatusInternalServerError).JSON(fiber.Map{"error": "internal_server_error"})
	}

	form := models.Form{}
	if err := db.Where("id = ?", formId).First(&form).Error; err != nil {
		return ctx.Status(fiber.StatusInternalServerError).JSON(fiber.Map{"error": err.Error()})
	}

	if !form.Active {
		return ctx.Status(fiber.StatusUnauthorized).JSON(fiber.Map{"error": "form_inactive"})
	}

	if !form.AllowResponseUpdate {
		return ctx.Status(fiber.StatusUnauthorized).JSON(fiber.Map{"error": "response updated not allowed"})
	}

	formResponse := models.FormResponse{}
	if err := db.Where("id = ?", reqBody.ID).First(&formResponse).Error; err != nil {
		return ctx.Status(fiber.StatusInternalServerError).JSON(fiber.Map{"error": err.Error()})
	}

	if *formResponse.CreatedByID == 0 || formResponse.CreatedByID != &userId {
		return ctx.Status(fiber.StatusUnauthorized).JSON(fiber.Map{"error": "invalid form response"})
	}

	formResponse.DeviceIP = utils.GetDeviceIP(ctx)
	formResponse.Response = reqBody.Response
	formResponse.UpdatedBy = models.UpdatedBy{UpdatedByID: &userId}

	return ctx.Status(fiber.StatusCreated).JSON(fiber.Map{"message": "response_submitted"})
}

func getFormResponseCount(ctx *fiber.Ctx) error {
	formId := ctx.Params("formId")

	db, err := utils.GetTenantDbFromCtx(ctx)
	if err != nil {
		return ctx.Status(fiber.StatusInternalServerError).JSON(fiber.Map{"error": "internal_server_error"})
	}

	var responseCount int64 = 0
	if err := db.Model(&models.FormResponse{}).Where("\"formId\" = ?", formId).Count(&responseCount).Error; err != nil {
		return ctx.Status(fiber.StatusInternalServerError).JSON(fiber.Map{"error": err.Error()})
	}

	return ctx.JSON(fiber.Map{"count": responseCount})
}

func getPaginatedFormResponses(ctx *fiber.Ctx) error {
	reqBody := utils.PaginationRequestBody{}
	if err := ctx.QueryParser(&reqBody); err != nil {
		return ctx.Status(fiber.StatusBadRequest).JSON(fiber.Map{"error": "Bad Request"})
	}

	if reqBody.Page <= 0 {
		reqBody.Page = 1
	}

	if reqBody.Limit <= 0 {
		reqBody.Limit = 10
	}

	reqBody.Limit = min(reqBody.Limit, 50)

	db, err := utils.GetTenantDbFromCtx(ctx)
	if err != nil {
		return ctx.Status(fiber.StatusInternalServerError).JSON(fiber.Map{"error": "Internal Server Error"})
	}

	formResponses := []models.FormResponse{}
	if err := db.Limit(reqBody.Limit).Offset((reqBody.Page - 1) * reqBody.Limit).Find(&formResponses).Error; err != nil {
		return ctx.Status(fiber.StatusInternalServerError).JSON(fiber.Map{"error": "Internal Server Error"})
	}

	var count int64 = 0
	if err := db.Model(&models.Form{}).Count(&count).Error; err != nil {
		return ctx.Status(fiber.StatusInternalServerError).JSON(fiber.Map{"error": "Internal Server Error"})
	}

	paginationResponse := utils.PaginationResponse[models.FormResponse]{
		Docs:            formResponses,
		Limit:           reqBody.Limit,
		Count:           len(formResponses),
		TotalDocs:       int(count),
		CurrentPage:     reqBody.Page,
		HasNextPage:     int(count) > reqBody.Page*reqBody.Limit,
		HasPreviousPage: reqBody.Page > 1,
	}

	return ctx.Status(fiber.StatusOK).JSON(paginationResponse)
}

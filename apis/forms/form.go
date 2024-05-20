package forms

import (
	"bizmate/models"
	"bizmate/utils"

	"github.com/gofiber/fiber/v2"
)

type formReqBody struct {
	ID                     uint   `json:"id,omitempty" required:""`
	Title                  string `json:"title" validate:"required"`
	Description            string `json:"description" validate:"required"`
	Body                   string `json:"body" validate:"required"`
	SubmitText             string `json:"submitText" validate:"required"`
	CancelText             string `json:"cancelText" validate:"required"`
	SuccessPage            string `json:"successPage,omitempty" validate:""`
	FailurePage            string `json:"failurePage,omitempty" validate:""`
	Active                 *bool  `json:"active" validate:"required"`
	AllowAnonymousResponse *bool  `json:"allowAnonymousResponse" validate:"required"`
	AllowResponseUpdate    *bool  `json:"allowResponseUpdate" validate:"required"`
	AllowMultipleResponse  *bool  `json:"allowMultipleResponse" validate:"required"`
}

// TODO: proper and deep validation of form body on the basis of form schema
func createForm(ctx *fiber.Ctx) error {
	userId := ctx.Locals("userId").(uint)
	formBody := formReqBody{}

	if err := utils.ParseBodyAndValidate(ctx, &formBody); err != nil {
		return ctx.Status(fiber.StatusBadRequest).JSON(fiber.Map{"error": err.Error()})
	}

	form := models.Form{
		Title:                  formBody.Title,
		Description:            formBody.Description,
		Body:                   formBody.Body,
		SubmitText:             formBody.SubmitText,
		CancelText:             formBody.CancelText,
		SuccessPage:            "[]",
		FailurePage:            "[]",
		PreviousVersionIDs:     "[]",
		Active:                 utils.Ternary(formBody.Active != nil, *formBody.Active, false),
		AllowAnonymousResponse: utils.Ternary(formBody.AllowAnonymousResponse != nil, *formBody.AllowAnonymousResponse, false),
		AllowResponseUpdate:    utils.Ternary(formBody.AllowResponseUpdate != nil, *formBody.AllowResponseUpdate, false),
		AllowMultipleResponse:  utils.Ternary(formBody.AllowMultipleResponse != nil, *formBody.AllowMultipleResponse, false),
		CreatedBy:              models.CreatedBy{CreatedByID: userId},
	}

	db, err := utils.GetTenantDbFromCtx(ctx)
	if err != nil {
		return ctx.SendStatus(fiber.StatusInternalServerError)
	}

	if err := db.Create(&form).Error; err != nil {
		return ctx.SendStatus(fiber.StatusInternalServerError)
	}

	return ctx.Status(fiber.StatusCreated).JSON(form)
}

func deleteForm(ctx *fiber.Ctx) error {
	formId := ctx.Params("formId")
	return ctx.SendString("NOT IMPLEMENTED: formID = " + formId)
}

func updateFormById(ctx *fiber.Ctx) error {
	updateBody := formReqBody{}
	userId := ctx.Locals("userId").(uint)
	if userId == 0 {
		return ctx.Status(fiber.StatusUnauthorized).JSON(fiber.Map{"error": "Unauthorized"})
	}

	if err := utils.ParseBodyAndValidate(ctx, &updateBody); err != nil {
		return ctx.Status(fiber.StatusBadRequest).JSON(fiber.Map{"error": err.Error()})
	}

	if updateBody.ID == 0 {
		return ctx.Status(fiber.StatusBadRequest).JSON(fiber.Map{"error": "Bad Request"})
	}

	db, err := utils.GetTenantDbFromCtx(ctx)
	if err != nil {
		return ctx.SendStatus(fiber.StatusInternalServerError)
	}

	form := models.Form{}
	if err := db.Where("id = ?", updateBody.ID).First(&form).Error; err != nil {
		return ctx.SendStatus(fiber.StatusInternalServerError)
	}

	form.Title = updateBody.Title
	form.Description = updateBody.Description
	form.SubmitText = updateBody.SubmitText
	form.CancelText = updateBody.CancelText
	//  `body` and `previousVersionIDs` are not updatable fields because form may get inconsistent
	// form `body` cannot be updated, in case of update, new form should be created and old form should be marked as inactive, and `previousVersionIDs` field of the new form should be updated
	form.SuccessPage = utils.Ternary(updateBody.SuccessPage != "", updateBody.SuccessPage, form.SuccessPage)
	form.FailurePage = utils.Ternary(updateBody.FailurePage != "", updateBody.FailurePage, form.FailurePage)
	form.Active = utils.Ternary(updateBody.Active != nil, *updateBody.Active, false)
	form.AllowAnonymousResponse = utils.Ternary(updateBody.AllowAnonymousResponse != nil, *updateBody.AllowAnonymousResponse, false)
	form.AllowResponseUpdate = utils.Ternary(updateBody.AllowResponseUpdate != nil, *updateBody.AllowResponseUpdate, false)
	form.AllowMultipleResponse = utils.Ternary(updateBody.AllowMultipleResponse != nil, *updateBody.AllowMultipleResponse, false)
	form.UpdatedBy.UpdatedByID = &userId

	if err := db.Save(&form).Error; err != nil {
		return ctx.SendStatus(fiber.StatusInternalServerError)
	}

	return ctx.Status(fiber.StatusOK).JSON(form)
}

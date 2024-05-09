package forms

import (
	"bizmate/models"
	"bizmate/utils"
	"fmt"

	"github.com/go-playground/validator/v10"
	"github.com/gofiber/fiber/v2"
)

func getFormById(ctx *fiber.Ctx) error {
	formId := ctx.Params("id")
	fmt.Println("id = ", formId)

	db, err := utils.GetTenantDbFromCtx(ctx)
	if err != nil {
		return ctx.Status(fiber.StatusInternalServerError).JSON(fiber.Map{"error": "internal_server_error"})
	}

	form := models.Form{}
	if err := db.Where("id = ?", formId).First(&form).Error; err != nil {
		return ctx.Status(fiber.StatusInternalServerError).JSON(fiber.Map{"error": "internal_server_error"})
	}

	return ctx.Status(fiber.StatusOK).JSON(form)
}

// TODO: proper and deep validation of form body on the basis of form schema
func createForm(ctx *fiber.Ctx) error {
	formBody := struct {
		Body         string `json:"body" validate:"required"`
		CancelText   string `json:"cancelText" validate:"required"`
		SubmitText   string `json:"submitText" validate:"required"`
		AuthRequired bool   `json:"authRequired" validate:""`
	}{}

	err := ctx.BodyParser(&formBody)
	if err != nil {
		return ctx.Status(fiber.StatusBadRequest).JSON(fiber.Map{"error": "Bad Request"})
	}

	validate := validator.New()
	err = validate.Struct(formBody)
	if err != nil {
		fmt.Println(err)
		return ctx.Status(fiber.StatusBadRequest).JSON(fiber.Map{"error": "Bad Request, Validation Failed"})
	}

	db, err := utils.GetTenantDbFromCtx(ctx)
	if err != nil {
		return ctx.Status(fiber.StatusInternalServerError).JSON(fiber.Map{"error": "Internal Server Error"})
	}

	form := models.Form{
		Body:               formBody.Body,
		AuthRequired:       formBody.AuthRequired,
		SubmitText:         formBody.SubmitText,
		CancelText:         formBody.CancelText,
		SuccessPage:        "",
		FailurePage:        "",
		Active:             false,
		PreviousVersionIDs: "[]",
	}

	if err := db.Create(&form).Error; err != nil {
		return ctx.Status(fiber.StatusInternalServerError).JSON(fiber.Map{"error": "Internal Server Error"})
	}

	return ctx.Status(fiber.StatusCreated).JSON(form)
}

func deleteForm(ctx *fiber.Ctx) error {
	return ctx.SendString("Hello, World!")
}

func updateFormById(ctx *fiber.Ctx) error {
	return ctx.SendString("Hello, World!")
}

func getPaginatedForms(ctx *fiber.Ctx) error {
	return ctx.SendString("Hello, World!")
}

func getFormReports(ctx *fiber.Ctx) error {
	return ctx.SendString("Hello, World!")
}

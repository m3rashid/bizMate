package emailtemplates

import (
	"bizmate/models"
	"bizmate/utils"
	"fmt"
	"strings"

	"github.com/gofiber/fiber/v2"
)

func createEmailTemplate(ctx *fiber.Ctx) error {
	userId := ctx.Locals("userId").(uint)
	db, err := utils.GetTenantDbFromCtx(ctx)
	if err != nil {
		return ctx.SendStatus(fiber.StatusInternalServerError)
	}

	template := models.EmailTemplate{}
	if err := utils.ParseBodyAndValidate(ctx, &template); err != nil {
		return ctx.Status(fiber.StatusBadRequest).JSON(fiber.Map{"error": err.Error()})
	}

	var emailHtmlTemplate = HTML{
		HtmlString:    template.BodyTemplate,
		SubjectString: template.SubjectTemplate,
	}
	emailHtmlTemplate.removeCommentsAndCompress()
	variables := emailHtmlTemplate.getVariables()
	template.Variables = strings.Join(variables, ",")
	template.CreatedBy = models.CreatedBy{CreatedByID: userId}

	if err := db.Create(&template).Error; err != nil {
		return ctx.SendStatus(fiber.StatusInternalServerError)
	}

	return ctx.Status(fiber.StatusCreated).JSON(template)
}

func updateEmailTemplate(ctx *fiber.Ctx) error {
	templateId := ctx.Params("templateId")
	fmt.Println(templateId)

	return ctx.SendStatus(fiber.StatusOK)
}

func deleteEmailTemplate(ctx *fiber.Ctx) error {
	templateId := ctx.Params("templateId")

	db, err := utils.GetTenantDbFromCtx(ctx)
	if err != nil {
		return ctx.SendStatus(fiber.StatusInternalServerError)
	}

	template := models.EmailTemplate{}
	if err := db.Where("id = ?", templateId).First(&template).Error; err != nil || template.ID == 0 {
		return ctx.SendStatus(fiber.StatusNotFound)
	}

	return ctx.SendStatus(fiber.StatusOK)
}

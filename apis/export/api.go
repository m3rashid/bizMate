package export

import (
	"bizmate/models"
	"bizmate/utils"
	"encoding/json"
	"fmt"
	"strings"

	"github.com/gofiber/fiber/v2"
)

type ExportFormat string

const (
	excelFormat ExportFormat = "xlsx"
	csvFormat   ExportFormat = "csv"
)

func exportTable(ctx *fiber.Ctx) error {
	reqBody := struct {
		TableName string       `json:"tableName" validate:"required"`
		Fields    []string     `json:"fields" validate:"required"`
		Format    ExportFormat `json:"format" validate:"required"`
		FormId    uint         `json:"formId"`
	}{}

	userId := ctx.Locals("userId").(uint)
	if userId == 0 {
		return ctx.Status(fiber.StatusUnauthorized).JSON("Unauthorized")
	}

	if err := utils.ParseBodyAndValidate(ctx, &reqBody); err != nil {
		return ctx.Status(fiber.StatusBadRequest).JSON(err.Error())
	}

	table, ok := exportableTables[reqBody.TableName]
	if !ok {
		return ctx.Status(fiber.StatusBadRequest).JSON("table data not exportable")
	}

	if table.name == models.FORM_RESPONSE_MODEL_NAME && reqBody.FormId == 0 {
		return ctx.Status(fiber.StatusBadRequest).JSON("formId is required for this export")
	}

	db, err := utils.GetTenantDbFromCtx(ctx)
	if err != nil {
		return ctx.SendStatus(fiber.StatusInternalServerError)
	}

	if table.name == models.FORM_RESPONSE_MODEL_NAME {
		responses := []models.FormResponse{}
		if err := db.Where("formId = ?", reqBody.FormId).Find(&responses).Error; err != nil {
			return ctx.Status(fiber.StatusNotFound).JSON("form not found")
		}
	}

	res := []map[string]interface{}{}

	tableFields := []string{}
	for _, field := range reqBody.Fields {
		tableFields = append(tableFields, fmt.Sprintf("\"%s\"", field))
	}

	query := fmt.Sprintf("SELECT %s FROM %s;", strings.Join(tableFields, ", "), table.name)
	// point of error (in case of large data from database)
	if err := db.Raw(query).Scan(&res).Error; err != nil {
		return ctx.SendStatus(fiber.StatusInternalServerError)
	}

	if reqBody.Format == csvFormat {
		csvFileName := gstCsvFileName(reqBody.TableName, ctx)
		if csvFileName == "" {
			ctx.SendStatus(fiber.StatusInternalServerError)
		}

		ctx.Set("Content-Disposition", fmt.Sprintf("attachment; filename=%s", csvFileName))
		ctx.Set("Content-Type", "text/csv")
		return handleCsvExport(res, reqBody.Fields, ctx)
	}

	if reqBody.Format == excelFormat {

	}

	return ctx.Status(fiber.StatusOK).JSON(reqBody)
}

func getExportTableFields(ctx *fiber.Ctx) error {
	reqBody := struct {
		TableName string `json:"tableName" validate:"required"`
		FormId    uint   `json:"formId"`
	}{}

	userId := ctx.Locals("userId").(uint)
	if userId == 0 {
		return ctx.Status(fiber.StatusUnauthorized).JSON("Unauthorized")
	}

	if err := utils.ParseBodyAndValidate(ctx, &reqBody); err != nil {
		return ctx.Status(fiber.StatusBadRequest).JSON(err.Error())
	}

	table, ok := exportableTables[reqBody.TableName]
	if !ok {
		return ctx.Status(fiber.StatusBadRequest).JSON("table data not exportable")
	}

	if table.name == models.FORM_RESPONSE_MODEL_NAME && reqBody.FormId == 0 {
		return ctx.Status(fiber.StatusBadRequest).JSON("formId is required for this export")
	}

	type resultStr struct {
		Name  string `json:"name"`
		Label string `json:"label"`
	}

	csvFileName := gstCsvFileName(reqBody.TableName, ctx)
	if csvFileName == "" {
		ctx.SendStatus(fiber.StatusInternalServerError)
	}

	if table.name == models.FORM_RESPONSE_MODEL_NAME {
		db, err := utils.GetTenantDbFromCtx(ctx)
		if err != nil {
			return ctx.SendStatus(fiber.StatusInternalServerError)
		}

		// get the corresponding form and generate the schema
		form := models.Form{}
		if err := db.Where("id = ?", reqBody.FormId).First(&form).Error; err != nil {
			return ctx.Status(fiber.StatusNotFound).JSON("form not found")
		}

		formMeta := []models.FormElementInstanceType{}
		if err := json.Unmarshal([]byte(form.Body), &formMeta); err != nil {
			return ctx.Status(fiber.StatusNotFound).JSON("error in form json")
		}

		results := []resultStr{
			{Name: "createdAt", Label: utils.CamelCaseToSentenceCase("createdAt")},
			{Name: "id", Label: utils.CapitalizeFirstLetter("id")},
			{Name: "formId", Label: utils.CamelCaseToSentenceCase("formId")},
			{Name: "deviceIp", Label: utils.CamelCaseToSentenceCase("deviceIp")},
		}
		for _, meta := range formMeta {
			if meta.Name.IsFormElement() && meta.Props["name"] != "" && meta.Props["label"] != "" {
				results = append(results, resultStr{
					Name:  (meta.Props["name"]).(string),
					Label: (meta.Props["label"]).(string),
				})
			}
		}

		return ctx.Status(fiber.StatusOK).JSON(fiber.Map{"fields": results, "csvFileName": csvFileName})
	}

	results := []resultStr{}
	for key := range table.schema {
		results = append(results, resultStr{Name: key, Label: utils.CamelCaseToSentenceCase(key)})
	}

	return ctx.Status(fiber.StatusOK).JSON(fiber.Map{"fields": results, "csvFileName": csvFileName})
}

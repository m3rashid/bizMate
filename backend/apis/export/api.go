package export

import (
	"bizMate/models"
	"bizMate/utils"
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
	userId, _ := utils.GetUserAndWorkspaceIdsOrZero(ctx)
	if userId == 0 {
		return ctx.Status(fiber.StatusUnauthorized).JSON("Unauthorized")
	}

	reqBody := exportTableReqBodyType{}
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

	db, err := utils.GetDB()
	if err != nil {
		return ctx.SendStatus(fiber.StatusInternalServerError)
	}

	if utils.Includes(reqBody.Fields, "createdBy") {
		db = db.Preload("CreatedByUser")
	}

	if utils.Includes(reqBody.Fields, "updatedBy") {
		db = db.Preload("UpdatedByUser")
	}

	res := []map[string]interface{}{}
	if table.name == models.FORM_RESPONSE_MODEL_NAME {
		responses := []models.FormResponse{}
		// TODO: point of error (in case of large data from database)
		if err := db.Where("\"formId\" = ?", reqBody.FormId).Find(&responses).Error; err != nil {
			return ctx.Status(fiber.StatusNotFound).JSON("form not found")
		}

		for _, response := range responses {
			temp := map[string]interface{}{}
			if err := json.Unmarshal([]byte(response.Response), &temp); err != nil {
				continue
			}

			temp["id"] = response.ID
			temp["formId"] = response.FormID
			temp["deviceIp"] = utils.Ternary(response.DeviceIP == "", "-", response.DeviceIP)
			temp["createdAt"] = response.CreatedAt
			res = append(res, temp)
		}
	} else {
		tableFields := []string{}
		for _, field := range reqBody.Fields {
			if field == "createdBy" || field == "updatedBy" {
				continue
			}
			tableFields = append(tableFields, fmt.Sprintf("\"%s\"", field))
		}
		// TODO: point of error (in case of large data from database)
		if err := db.Raw(fmt.Sprintf("SELECT %s FROM %s;", strings.Join(tableFields, ", "), table.name)).Scan(&res).Error; err != nil {
			return ctx.SendStatus(fiber.StatusInternalServerError)
		}
	}

	if reqBody.Format == csvFormat {
		return handleCsvExport(reqBody, res, ctx)
	} else if reqBody.Format == excelFormat {
		return handleExcelExport(reqBody, res, ctx)
	}

	return ctx.Status(fiber.StatusOK).JSON(reqBody)
}

type exportTableFieldsReqBody = struct {
	TableName string `json:"tableName" validate:"required"`
	FormId    uint   `json:"formId"`
}

func getExportTableFields(ctx *fiber.Ctx) error {
	reqBody := exportTableFieldsReqBody{}
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

	fileNameWithoutExt := getFileName(reqBody.TableName, ctx)

	if table.name == models.FORM_RESPONSE_MODEL_NAME {
		db, err := utils.GetDB()
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
			if meta.Name.IsFormInputElement() && meta.Props["name"] != "" && meta.Props["label"] != "" {
				results = append(results, resultStr{
					Name:  (meta.Props["name"]).(string),
					Label: (meta.Props["label"]).(string),
				})
			}
		}

		return ctx.Status(fiber.StatusOK).JSON(fiber.Map{"fields": results, "fileNameWithoutExt": fileNameWithoutExt})
	}

	results := []resultStr{}
	for key := range table.schema {
		results = append(results, resultStr{Name: key, Label: utils.CamelCaseToSentenceCase(key)})
	}

	return ctx.Status(fiber.StatusOK).JSON(fiber.Map{"fields": results, "fileNameWithoutExt": fileNameWithoutExt})
}

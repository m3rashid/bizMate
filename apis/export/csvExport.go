package export

import (
	"encoding/csv"
	"fmt"

	"github.com/gofiber/fiber/v2"
)

func gstCsvFileName(tableName string, ctx *fiber.Ctx) string {
	return getFileName(tableName, ctx) + ".csv"
}

func handleCsvExport(reqBody exportTableReqBodyType, allData []map[string]interface{}, ctx *fiber.Ctx) error {
	csvFileName := gstCsvFileName(reqBody.TableName, ctx)
	if csvFileName == "" {
		ctx.SendStatus(fiber.StatusInternalServerError)
	}

	writer := csv.NewWriter(ctx)
	defer writer.Flush()

	if err := writer.Write(reqBody.Fields); err != nil {
		return err
	}

	for _, record := range allData {
		data := []string{}
		for _, field := range reqBody.Fields {
			fieldData, ok := record[field]
			if !ok {
				fieldData = "-"
			}
			data = append(data, fmt.Sprintf("%v", fieldData))
		}

		if err := writer.Write(data); err != nil {
			return err
		}
	}

	ctx.Set("Content-Disposition", fmt.Sprintf("attachment; filename=%s", csvFileName))
	ctx.Set("Content-Type", "text/csv")

	return nil
}

package export

import (
	"bizmate/utils"
	"encoding/csv"
	"fmt"
	"reflect"
	"strings"

	"github.com/gofiber/fiber/v2"
)

func gstCsvFileName(tableName string, ctx *fiber.Ctx) string {
	tenantOrigin, err := utils.GetTenantOriginFromCtx(ctx)
	if err != nil {
		return ""
	}
	tenantOrigin = strings.Replace(tenantOrigin, ":", "", 1)
	return fmt.Sprintf("%s-%s-records.csv", tenantOrigin, tableName)
}

func handleCsvExport(data []map[string]interface{}, fields []string, ctx *fiber.Ctx) error {
	writer := csv.NewWriter(ctx)
	defer writer.Flush()

	if err := writer.Write(fields); err != nil {
		return err
	}

	for _, record := range data {
		data := []string{}
		for _, field := range fields {
			fieldData, ok := record[field]
			if !ok {
				data = append(data, "")
			} else {
				if reflect.TypeOf(fieldData) == reflect.TypeOf("") {
					data = append(data, fieldData.(string))
				} else if reflect.TypeOf(fieldData) == reflect.TypeOf(true) {
					data = append(data, utils.Ternary(fieldData.(bool), "true", "false"))
				}
			}
		}

		if err := writer.Write(data); err != nil {
			return err
		}
	}

	return nil
}

package export

import (
	"bizmate/utils"
	"fmt"
	"strings"

	"github.com/gofiber/fiber/v2"
)

type exportTableReqBodyType = struct {
	TableName string       `json:"tableName" validate:"required"`
	Fields    []string     `json:"fields" validate:"required"`
	Format    ExportFormat `json:"format" validate:"required"`
	FormId    uint         `json:"formId"`
}

func getFileName(tableName string, ctx *fiber.Ctx) string {
	tenantOrigin, err := utils.GetTenantOriginFromCtx(ctx)
	if err != nil {
		return ""
	}
	tenantOrigin = strings.Replace(tenantOrigin, ":", "", 1)
	return fmt.Sprintf("%s-%s-records", tenantOrigin, tableName)
}

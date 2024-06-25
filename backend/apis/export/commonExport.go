package export

import (
	"bizMate/utils"
	"fmt"

	"github.com/gofiber/fiber/v2"
)

type exportTableReqBodyType = struct {
	TableName string       `json:"tableName" validate:"required"`
	Fields    []string     `json:"fields" validate:"required"`
	Format    ExportFormat `json:"format" validate:"required"`
	FormId    uint         `json:"formId"`
}

func getFileName(tableName string, ctx *fiber.Ctx) string {
	userId, tenantId := utils.GetUserAndTenantIdsOrZero(ctx)
	return fmt.Sprintf("%s-%d_%d-records", tableName, userId, tenantId)
}

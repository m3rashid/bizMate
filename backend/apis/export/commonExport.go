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
	FormId    string       `json:"formId"`
}

func getFileName(tableName string, ctx *fiber.Ctx) string {
	userId, workspaceId := utils.GetUserAndWorkspaceIdsOrZero(ctx)
	return fmt.Sprintf("%s-%d_%d-records", tableName, userId, workspaceId)
}

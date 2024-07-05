package auth

import (
	"bizMate/models"
	"bizMate/utils"

	"github.com/gofiber/fiber/v2"
)

func getWorkspaces(ctx *fiber.Ctx) error {
	userId, _ := utils.GetUserAndWorkspaceIdsOrZero(ctx)
	db, err := utils.GetPostgresDB()
	if err != nil {
		return ctx.SendStatus(fiber.StatusInternalServerError)
	}

	workspaces := []models.Workspace{}
	currentUser := models.User{BaseModel: models.BaseModel{ID: userId.String()}}
	filter := models.Workspace{Users: []*models.User{&currentUser}}
	if err := db.Preload("Users").Where(&filter).Find(&workspaces).Error; err != nil {
		return ctx.SendStatus(fiber.StatusInternalServerError)
	}

	return ctx.Status(fiber.StatusOK).JSON(workspaces)
}

package auth

import (
	"bizMate/models"
	"bizMate/utils"
	"fmt"

	"github.com/gofiber/fiber/v2"
)

func getWorkspaces(ctx *fiber.Ctx) error {
	userId, _ := utils.GetUserAndWorkspaceIdsOrZero(ctx)
	db, err := utils.GetPostgresDB()
	if err != nil {
		return fiber.NewError(fiber.StatusInternalServerError)
	}

	workspaces := []models.Workspace{}
	currentUser := models.User{BaseModel: models.BaseModel{ID: userId.String()}}
	filter := models.Workspace{Users: []*models.User{&currentUser}}
	if err := db.Preload("Users").Where(&filter).Find(&workspaces).Error; err != nil {
		return fiber.NewError(fiber.StatusInternalServerError)
	}

	return ctx.Status(fiber.StatusOK).JSON(fiber.Map{
		"success": true,
	})
}

func createWorkspace(ctx *fiber.Ctx) error {
	userId, _ := utils.GetUserAndWorkspaceIdsOrZero(ctx)
	fmt.Println(userId)
	return nil
}

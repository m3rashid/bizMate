package seed

import (
	"bizMate/models"
	"bizMate/utils"

	"github.com/gofiber/fiber/v2"
	"github.com/google/uuid"
	"github.com/jaswdr/faker/v2"
)

type seedProjectReqBody struct {
	Count       int    `json:"count" validate:"required,gte=1"`
	WorkspaceID string `json:"workspaceId" validate:"required"`
}

func seedProjects(ctx *fiber.Ctx) error {
	const batchSize = 100
	userId, _ := utils.GetUserAndWorkspaceIdsOrZero(ctx)
	if userId == uuid.Nil {
		return ctx.SendStatus(fiber.StatusUnauthorized)
	}

	reqBody := seedProjectReqBody{}
	if err := utils.ParseBodyAndValidate(ctx, &reqBody); err != nil {
		return ctx.SendStatus(fiber.StatusBadRequest)
	}
	if reqBody.Count < 1 {
		return ctx.SendStatus(fiber.StatusBadRequest)
	}

	projects := []models.Project{}
	fake := faker.New()
	for i := 0; i < reqBody.Count; i++ {
		projects = append(projects, models.Project{
			Name:                   fake.Company().Name(),
			Description:            fake.Company().CatchPhrase(),
			CreatedBy:              models.CreatedBy{CreatedByID: userId.String()},
			BaseModelWithWorkspace: models.BaseModelWithWorkspace{WorkspaceID: reqBody.WorkspaceID},
		})
	}

	db, err := utils.GetDB()
	if err != nil {
		return ctx.SendStatus(fiber.StatusInternalServerError)
	}

	if err := db.CreateInBatches(projects, batchSize).Error; err != nil {
		return ctx.SendStatus(fiber.StatusInternalServerError)
	}

	return ctx.SendStatus(fiber.StatusOK)
}

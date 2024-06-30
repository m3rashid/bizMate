package seed

import (
	"bizMate/models"
	"bizMate/utils"

	"github.com/gofiber/fiber/v2"
	"github.com/jaswdr/faker/v2"
)

type seedContactReqBody struct {
	Count int `json:"count" validate:"required,gte=1"`
}

func seedContacts(ctx *fiber.Ctx) error {
	const batchSize = 100
	userId, workspaceId := utils.GetUserAndWorkspaceIdsOrZero(ctx)
	if userId == 0 {
		return ctx.SendStatus(fiber.StatusUnauthorized)
	}

	reqBody := seedContactReqBody{}
	if err := utils.ParseBodyAndValidate(ctx, &reqBody); err != nil {
		return ctx.SendStatus(fiber.StatusBadRequest)
	}
	if reqBody.Count < 1 {
		return ctx.SendStatus(fiber.StatusBadRequest)
	}

	contacts := []models.Contact{}
	fake := faker.New()
	for i := 0; i < reqBody.Count; i++ {
		contacts = append(contacts, models.Contact{
			Name:                   fake.Person().Name(),
			Email:                  fake.Internet().Email(),
			CreatedBy:              models.CreatedBy{CreatedByID: userId},
			BaseModelWithWorkspace: models.BaseModelWithWorkspace{WorkspaceID: workspaceId},
		})
	}

	db, err := utils.GetDB()
	if err != nil {
		return ctx.SendStatus(fiber.StatusInternalServerError)
	}

	if err := db.CreateInBatches(contacts, batchSize).Error; err != nil {
		return ctx.SendStatus(fiber.StatusInternalServerError)
	}

	return ctx.SendStatus(fiber.StatusOK)
}

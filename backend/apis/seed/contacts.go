package seed

import (
	"bizMate/utils"

	"github.com/gofiber/fiber/v2"
	"github.com/google/uuid"
)

type seedContactReqBody struct {
	Count       int    `json:"count" validate:"required,gte=1"`
	WorkspaceID string `json:"workspaceId" validate:"required"`
}

func seedContacts(ctx *fiber.Ctx) error {
	userId, _ := utils.GetUserAndWorkspaceIdsOrZero(ctx)
	if userId == uuid.Nil {
		return fiber.NewError(fiber.StatusUnauthorized)
	}

	reqBody := seedContactReqBody{}
	if err := utils.ParseBodyAndValidate(ctx, &reqBody); err != nil {
		return ctx.SendStatus(fiber.StatusBadRequest)
	}

	if reqBody.Count < 1 || reqBody.Count > 5000 {
		return ctx.SendStatus(fiber.StatusBadRequest)
	}

	// contacts := []models.Contact{}
	// fake := faker.New()
	// for i := 0; i < reqBody.Count; i++ {
	// 	contacts = append(contacts, models.Contact{
	// 		Name:                   fake.Person().Name(),
	// 		Email:                  fake.Internet().Email(),
	// 		CreatedBy:              models.CreatedBy{CreatedByID: userId.String()},
	// 		BaseModelWithWorkspace: models.BaseModelWithWorkspace{WorkspaceID: reqBody.WorkspaceID},
	// 	})
	// }

	// db, err := utils.GetPostgresDB()
	// if err != nil {
	// 	return ctx.SendStatus(fiber.StatusInternalServerError)
	// }

	// if err := db.CreateInBatches(contacts, batchSize).Error; err != nil {
	// 	return ctx.SendStatus(fiber.StatusInternalServerError)
	// }

	return ctx.Status(fiber.StatusOK).JSON(utils.SendResponse(nil, "Contacts seeded successfully"))
}

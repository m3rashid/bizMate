package seed

import (
	"github.com/gofiber/fiber/v2"
)

type seedUserReqBody struct {
	Count int `json:"count" validate:"required,gte=1"`
}

func seedUsers(ctx *fiber.Ctx) error {
	// const batchSize = 100
	// defaultPassword := os.Getenv("SEED_DEFAULT_PASSWORD")
	// if defaultPassword == "" {
	// 	return ctx.SendStatus(fiber.StatusInternalServerError)
	// }
	// password, err := utils.HashPassword(defaultPassword)
	// if err != nil {
	// 	return ctx.SendStatus(fiber.StatusInternalServerError)
	// }

	// reqBody := seedUserReqBody{}
	// if err := utils.ParseBodyAndValidate(ctx, &reqBody); err != nil {
	// 	return ctx.SendStatus(fiber.StatusBadRequest)
	// }
	// if reqBody.Count < 1 {
	// 	return ctx.SendStatus(fiber.StatusBadRequest)
	// }

	// users := []models.User{}

	// fake := faker.New()
	// for i := 0; i < reqBody.Count; i++ {
	// 	users = append(users, models.User{
	// 		Name:     fake.Person().Name(),
	// 		Email:    fake.Internet().Email(),
	// 		Password: password,
	// 		Provider: models.PROVIDER_CREDENTIALS,
	// 	})
	// }

	// db, err := utils.GetPostgresDB()
	// if err != nil {
	// 	return ctx.SendStatus(fiber.StatusInternalServerError)
	// }

	// if err := db.CreateInBatches(users, batchSize).Error; err != nil {
	// 	return ctx.SendStatus(fiber.StatusInternalServerError)
	// }

	return ctx.SendStatus(fiber.StatusOK)
}

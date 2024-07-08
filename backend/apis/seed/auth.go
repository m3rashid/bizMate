package seed

import (
	"bizMate/repository"
	"bizMate/utils"
	"os"

	"github.com/gofiber/fiber/v2"
	"github.com/jaswdr/faker/v2"
)

type seedUserReqBody struct {
	Count int `json:"count" validate:"required,gte=1"`
}

func seedUsers(ctx *fiber.Ctx) error {
	defaultPassword := os.Getenv("SEED_DEFAULT_PASSWORD")
	if defaultPassword == "" {
		return ctx.SendStatus(fiber.StatusInternalServerError)
	}
	password, err := utils.HashPassword(defaultPassword)
	if err != nil {
		return ctx.SendStatus(fiber.StatusInternalServerError)
	}

	reqBody := seedUserReqBody{}
	if err := utils.ParseBodyAndValidate(ctx, &reqBody); err != nil {
		return ctx.SendStatus(fiber.StatusBadRequest)
	}

	if reqBody.Count < 1 || reqBody.Count > 5000 {
		return ctx.SendStatus(fiber.StatusBadRequest)
	}

	pgConn, err := utils.GetPostgresDB()
	if err != nil {
		return fiber.NewError(fiber.StatusInternalServerError)
	}

	fake := faker.New()

	insertCount := 0
	queries := repository.New(pgConn)
	for i := 0; i < reqBody.Count; i++ {
		id, err := utils.GenerateUuidV7()
		if err != nil {
			continue
		}

		if _, err = queries.CreateUser(ctx.Context(), repository.CreateUserParams{
			ID:           id,
			Name:         fake.Person().Name(),
			Email:        fake.Internet().Email(),
			Password:     password,
			Provider:     repository.PROVIDER_CREDENTIALS,
			Phone:        "",
			RefreshToken: "",
			Avatar:       "",
		}); err != nil {
			break
		}

		insertCount++
	}

	return ctx.Status(fiber.StatusCreated).JSON(utils.SendResponse(
		fiber.Map{"inserted": insertCount, "expected": reqBody.Count, "failed": reqBody.Count - insertCount},
		"Users seeded successfully",
	))
}

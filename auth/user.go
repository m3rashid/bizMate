package auth

import (
	"bizmate/models"
	"bizmate/utils"

	"github.com/go-playground/validator/v10"
	"github.com/gofiber/fiber/v2"
)

func getUser(ctx *fiber.Ctx) error {
	userId := ctx.Locals("userId").(string)
	db, err := utils.GetTenantDbFromCtx(ctx)
	if err != nil {
		return ctx.Status(fiber.StatusInternalServerError).JSON(fiber.Map{"error": "internal_server_error"})
	}

	user := models.User{}
	if err := db.Where("id = ?", userId).First(&user).Error; err != nil {
		return ctx.Status(fiber.StatusInternalServerError).JSON(fiber.Map{"error": "internal_server_error"})
	}

	return ctx.JSON(user)
}

func credentialsLogin(ctx *fiber.Ctx) error {
	loginBody := struct {
		Email    string `json:"email" validate:"required,email"`
		Password string `json:"password" validate:"required"`
	}{}
	err := ctx.BodyParser(&loginBody)
	if err != nil {
		return ctx.Status(fiber.StatusBadRequest).JSON(fiber.Map{"error": "bad_request"})
	}

	validate := validator.New()
	err = validate.Struct(loginBody)
	if err != nil {
		return ctx.Status(fiber.StatusBadRequest).JSON(fiber.Map{"error": "bad_request"})
	}

	db, err := utils.GetTenantDbFromCtx(ctx)
	if err != nil {
		return ctx.Status(fiber.StatusInternalServerError).JSON(fiber.Map{"error": "internal_server_error"})
	}

	user := models.User{}
	if err := db.Where("email = ?", loginBody.Email).First(&user).Error; err != nil || user.ID == 0 {
		return ctx.Status(fiber.StatusUnauthorized).JSON(fiber.Map{"error": "unauthorized"})
	}

	if !VerifyPassword(user.Password, loginBody.Password) {
		return ctx.Status(fiber.StatusUnauthorized).JSON(fiber.Map{"error": "unauthorized"})
	}

	token, err := GenerateJWT(user.ID, user.Email)
	if err != nil {
		return ctx.Status(fiber.StatusInternalServerError).JSON(fiber.Map{"error": "internal_server_error"})
	}

	return ctx.JSON(fiber.Map{"token": token})
}

func credentialsRegister(ctx *fiber.Ctx) error {
	newUser := models.User{}
	err := ctx.BodyParser(&newUser)
	if err != nil {
		return ctx.Status(fiber.StatusBadRequest).JSON(fiber.Map{"error": "bad_request"})
	}

	validate := validator.New()
	err = validate.Struct(newUser)
	if err != nil {
		return ctx.Status(fiber.StatusBadRequest).JSON(fiber.Map{"error": "bad_request"})
	}

	db, err := utils.GetTenantDbFromCtx(ctx)
	if err != nil {
		return ctx.Status(fiber.StatusInternalServerError).JSON(fiber.Map{"error": "internal_server_error"})
	}

	if err := createUser(db, &newUser); err != nil {
		return ctx.Status(fiber.StatusInternalServerError).JSON(fiber.Map{"error": "internal_server_error"})
	}

	token, err := GenerateJWT(newUser.ID, newUser.Email)
	if err != nil {
		return ctx.Status(fiber.StatusInternalServerError).JSON(fiber.Map{"error": "internal_server_error"})
	}

	return ctx.JSON(fiber.Map{"token": token})
}

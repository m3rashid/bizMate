package auth

import (
	"bizmate/models"
	"bizmate/utils"
	"fmt"

	"github.com/go-playground/validator/v10"
	"github.com/gofiber/fiber/v2"
)

func toPartialUser(user models.User) fiber.Map {
	return fiber.Map{
		"id":        user.ID,
		"name":      user.Name,
		"email":     user.Email,
		"avatar":    user.Avatar,
		"createdAt": user.CreatedAt,
	}
}

func getUser(ctx *fiber.Ctx) error {
	userId := ctx.Locals("userId").(uint)
	db, err := utils.GetTenantDbFromCtx(ctx)
	if err != nil {
		return ctx.Status(fiber.StatusInternalServerError).JSON(fiber.Map{"error": "internal_server_error"})
	}

	user := models.User{}
	if err := db.Where("id = ?", userId).First(&user).Error; err != nil {
		return ctx.Status(fiber.StatusInternalServerError).JSON(fiber.Map{"error": "internal_server_error"})
	}

	return ctx.JSON(toPartialUser(user))
}

func credentialsLogin(ctx *fiber.Ctx) error {
	loginBody := struct {
		Email    string `json:"email" validate:"required,email"`
		Password string `json:"password" validate:"required"`
	}{}
	err := ctx.BodyParser(&loginBody)
	if err != nil {
		return ctx.Status(fiber.StatusBadRequest).JSON(fiber.Map{"error": "Bad Request"})
	}

	validate := validator.New()
	err = validate.Struct(loginBody)
	if err != nil {
		return ctx.Status(fiber.StatusBadRequest).JSON(fiber.Map{"error": "Bad Request, Validation Failed"})
	}

	db, err := utils.GetTenantDbFromCtx(ctx)
	if err != nil {
		return ctx.Status(fiber.StatusInternalServerError).JSON(fiber.Map{"error": "Internal Server Error"})
	}

	user := models.User{}
	if err := db.Where("email = ?", loginBody.Email).First(&user).Error; err != nil || user.ID == 0 {
		return ctx.Status(fiber.StatusNotFound).JSON(fiber.Map{"error": "User not found"})
	}

	if user.Provider != models.PROVIDER_CREDENTIALS {
		return ctx.Status(fiber.StatusBadRequest).JSON(fiber.Map{"error": "Wrong Provider"})
	}

	if !VerifyPassword(user.Password, loginBody.Password) {
		return ctx.Status(fiber.StatusNotFound).JSON(fiber.Map{"error": "User not found"})
	}

	token, err := GenerateJWT(user.ID, user.Email)
	if err != nil {
		return ctx.Status(fiber.StatusInternalServerError).JSON(fiber.Map{"error": "Internal Server Error"})
	}

	return ctx.JSON(fiber.Map{"token": token, "user": toPartialUser(user)})
}

func credentialsRegister(ctx *fiber.Ctx) error {
	registerBody := struct {
		Name     string `json:"name" validate:"required"`
		Email    string `json:"email" validate:"required,email"`
		Phone    string `json:"phone,omitempty" validate:""`
		Password string `json:"password" validate:"required"`
	}{}

	err := ctx.BodyParser(&registerBody)
	if err != nil {
		fmt.Println(err)
		return ctx.Status(fiber.StatusBadRequest).JSON(fiber.Map{"error": "Bad Request 1"})
	}

	validate := validator.New()
	err = validate.Struct(registerBody)
	if err != nil {
		return ctx.Status(fiber.StatusBadRequest).JSON(fiber.Map{"error": "Bad Request 2"})
	}

	password, err := HashPassword(registerBody.Password)
	if err != nil {
		return ctx.Status(fiber.StatusInternalServerError).JSON(fiber.Map{"error": "Internal Server Error"})
	}

	db, err := utils.GetTenantDbFromCtx(ctx)
	if err != nil {
		return ctx.Status(fiber.StatusInternalServerError).JSON(fiber.Map{"error": "Internal Server Error"})
	}

	newUser := models.User{
		Name:     registerBody.Name,
		Email:    registerBody.Email,
		Phone:    registerBody.Phone,
		Password: password,
		Provider: models.PROVIDER_CREDENTIALS,
	}

	if err := createUser(db, &newUser); err != nil {
		return ctx.Status(fiber.StatusInternalServerError).JSON(fiber.Map{"error": "Internal Server Error"})
	}

	token, err := GenerateJWT(newUser.ID, registerBody.Email)
	if err != nil {
		return ctx.Status(fiber.StatusInternalServerError).JSON(fiber.Map{"error": "Internal Server Error"})
	}

	return ctx.JSON(fiber.Map{"token": token, "user": toPartialUser(newUser)})
}

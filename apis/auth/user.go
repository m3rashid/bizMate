package auth

import (
	"bizmate/models"
	"bizmate/utils"

	"github.com/gofiber/fiber/v2"
)

func getUser(ctx *fiber.Ctx) error {
	userId := ctx.Locals("userId").(uint)
	db, err := utils.GetTenantDbFromCtx(ctx)
	if err != nil {
		return ctx.SendStatus(fiber.StatusInternalServerError)
	}

	user := models.User{}
	if err := db.Where("id = ?", userId).First(&user).Error; err != nil {
		return ctx.SendStatus(fiber.StatusInternalServerError)
	}

	return ctx.JSON(user.ToPartialUser())
}

func credentialsLogin(ctx *fiber.Ctx) error {
	loginBody := struct {
		Email    string `json:"email" validate:"required,email"`
		Password string `json:"password" validate:"required"`
	}{}

	if err := utils.ParseBodyAndValidate(ctx, &loginBody); err != nil {
		return ctx.Status(fiber.StatusBadRequest).JSON(err.Error())
	}

	db, err := utils.GetTenantDbFromCtx(ctx)
	if err != nil {
		return ctx.SendStatus(fiber.StatusInternalServerError)
	}

	user := models.User{}
	if err := db.Where("email = ?", loginBody.Email).First(&user).Error; err != nil || user.ID == 0 {
		return ctx.Status(fiber.StatusNotFound).JSON("User not found")
	}

	if user.Provider != models.PROVIDER_CREDENTIALS {
		return ctx.Status(fiber.StatusBadRequest).JSON("Wrong Provider")
	}

	if !utils.VerifyPassword(user.Password, loginBody.Password) {
		return ctx.Status(fiber.StatusNotFound).JSON("User not found")
	}

	token, err := utils.GenerateJWT(user.ID, user.Email)
	if err != nil {
		return ctx.SendStatus(fiber.StatusInternalServerError)
	}

	return ctx.JSON(fiber.Map{"token": token, "user": user.ToPartialUser()})
}

func credentialsRegister(ctx *fiber.Ctx) error {
	registerBody := struct {
		Name     string `json:"name" validate:"required"`
		Email    string `json:"email" validate:"required,email"`
		Phone    string `json:"phone,omitempty"`
		Password string `json:"password" validate:"required"`
	}{}

	if err := utils.ParseBodyAndValidate(ctx, &registerBody); err != nil {
		return ctx.Status(fiber.StatusBadRequest).JSON(err.Error())
	}

	password, err := utils.HashPassword(registerBody.Password)
	if err != nil {
		return ctx.SendStatus(fiber.StatusInternalServerError)
	}

	db, err := utils.GetTenantDbFromCtx(ctx)
	if err != nil {
		return ctx.SendStatus(fiber.StatusInternalServerError)
	}

	newUser := models.User{
		Name:     registerBody.Name,
		Email:    registerBody.Email,
		Phone:    registerBody.Phone,
		Password: password,
		Provider: models.PROVIDER_CREDENTIALS,
	}

	if err := db.Create(&newUser).Error; err != nil {
		return ctx.SendStatus(fiber.StatusInternalServerError)
	}

	token, err := utils.GenerateJWT(newUser.ID, registerBody.Email)
	if err != nil {
		return ctx.SendStatus(fiber.StatusInternalServerError)
	}

	return ctx.JSON(fiber.Map{"token": token, "user": newUser.ToPartialUser()})
}

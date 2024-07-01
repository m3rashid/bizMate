package auth

import (
	"bizMate/models"
	"bizMate/utils"

	"github.com/gofiber/fiber/v2"
)

func checkAuth(ctx *fiber.Ctx) error {
	userId, _ := utils.GetUserAndWorkspaceIdsOrZero(ctx)
	jwtToken, err := utils.GenerateJWT(userId.String(), ctx.Locals("email").(string))
	if err != nil {
		return ctx.SendStatus(fiber.StatusInternalServerError)
	}

	return ctx.JSON(fiber.Map{"token": jwtToken})
}

func getUser(ctx *fiber.Ctx) error {
	userId, _ := utils.GetUserAndWorkspaceIdsOrZero(ctx)
	db, err := utils.GetDB()
	if err != nil {
		return ctx.SendStatus(fiber.StatusInternalServerError)
	}

	user := models.User{}
	if err = db.Where("id = ?", userId).First(&user).Error; err != nil {
		return ctx.SendStatus(fiber.StatusNotFound)
	}

	return ctx.JSON(user.ToPartialUser())
}

func credentialsLogin(ctx *fiber.Ctx) error {
	reqBody := loginBodyReq{}
	if err := utils.ParseBodyAndValidate(ctx, &reqBody); err != nil {
		return ctx.Status(fiber.StatusBadRequest).JSON(err.Error())
	}

	db, err := utils.GetDB()
	if err != nil {
		return ctx.SendStatus(fiber.StatusInternalServerError)
	}

	user := models.User{}
	if err = db.Where("email = ?", reqBody.Email).First(&user).Error; err != nil || user.ID == "" {
		return ctx.SendStatus(fiber.StatusUnauthorized)
	}

	if user.Provider != models.PROVIDER_CREDENTIALS {
		return ctx.SendStatus(fiber.StatusBadRequest)
	}

	if !utils.ComparePasswords(user.Password, reqBody.Password) {
		return ctx.SendStatus(fiber.StatusUnauthorized)
	}

	token, err := utils.GenerateJWT(user.ID, user.Email)
	if err != nil {
		return ctx.SendStatus(fiber.StatusInternalServerError)
	}

	return ctx.JSON(fiber.Map{"token": token, "user": user.ToPartialUser()})
}

func credentialsRegister(ctx *fiber.Ctx) error {
	reqBody := redisterBodyReq{}
	if err := utils.ParseBodyAndValidate(ctx, &reqBody); err != nil {
		return ctx.Status(fiber.StatusBadRequest).JSON(err.Error())
	}

	password, err := utils.HashPassword(reqBody.Password)
	if err != nil {
		return ctx.SendStatus(fiber.StatusInternalServerError)
	}

	newUser := models.User{
		Name:     reqBody.Name,
		Email:    reqBody.Email,
		Phone:    reqBody.Phone,
		Password: password,
		Provider: models.PROVIDER_CREDENTIALS,
	}

	db, err := utils.GetDB()
	if err != nil {
		return ctx.SendStatus(fiber.StatusInternalServerError)
	}

	if err = db.Create(&newUser).Error; err != nil {
		return ctx.SendStatus(fiber.StatusInternalServerError)
	}

	token, err := utils.GenerateJWT(newUser.ID, newUser.Email)
	if err != nil {
		return ctx.SendStatus(fiber.StatusInternalServerError)
	}

	return ctx.JSON(fiber.Map{"token": token, "user": newUser.ToPartialUser()})
}

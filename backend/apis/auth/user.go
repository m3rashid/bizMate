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
		return fiber.NewError(fiber.StatusInternalServerError)
	}

	return ctx.Status(fiber.StatusOK).JSON(utils.SendResponse(jwtToken, "User authenticated successfully"))
}

func getUser(ctx *fiber.Ctx) error {
	userId, _ := utils.GetUserAndWorkspaceIdsOrZero(ctx)
	db, err := utils.GetPostgresDB()
	if err != nil {
		return fiber.NewError(fiber.StatusInternalServerError)
	}

	user := models.User{}
	if err = db.Where("id = ?", userId).First(&user).Error; err != nil {
		return fiber.NewError(fiber.StatusNotFound, "User not found")
	}

	return ctx.Status(fiber.StatusOK).JSON(utils.SendResponse(user.ToPartialUser(), "User found successfully"))
}

func credentialsLogin(ctx *fiber.Ctx) error {
	reqBody := loginBodyReq{}
	if err := utils.ParseBodyAndValidate(ctx, &reqBody); err != nil {
		return fiber.NewError(fiber.StatusBadRequest, err.Error())
	}

	db, err := utils.GetPostgresDB()
	if err != nil {
		return fiber.NewError(fiber.StatusInternalServerError)
	}

	user := models.User{}
	if err = db.Where("email = ?", reqBody.Email).First(&user).Error; err != nil || user.ID == "" {
		return fiber.NewError(fiber.StatusNotFound, "User not found")
	}

	if user.Provider != models.PROVIDER_CREDENTIALS {
		return fiber.NewError(fiber.StatusUnauthorized, "User not found")
	}

	if !utils.ComparePasswords(user.Password, reqBody.Password) {
		return fiber.NewError(fiber.StatusUnauthorized, "Invalid credentials")
	}

	token, err := utils.GenerateJWT(user.ID, user.Email)
	if err != nil {
		return fiber.NewError(fiber.StatusInternalServerError)
	}

	return ctx.Status(fiber.StatusOK).JSON(
		utils.SendResponse(fiber.Map{"token": token, "user": user.ToPartialUser()}, "User logged in successfully"),
	)
}

func credentialsRegister(ctx *fiber.Ctx) error {
	reqBody := redisterBodyReq{}
	if err := utils.ParseBodyAndValidate(ctx, &reqBody); err != nil {
		return fiber.NewError(fiber.StatusBadRequest, err.Error())
	}

	password, err := utils.HashPassword(reqBody.Password)
	if err != nil {
		return fiber.NewError(fiber.StatusInternalServerError)
	}

	newUser := models.User{
		Name:     reqBody.Name,
		Email:    reqBody.Email,
		Phone:    reqBody.Phone,
		Password: password,
		Provider: models.PROVIDER_CREDENTIALS,
	}

	db, err := utils.GetPostgresDB()
	if err != nil {
		return fiber.NewError(fiber.StatusInternalServerError)
	}

	if err = db.Create(&newUser).Error; err != nil {
		return fiber.NewError(fiber.StatusInternalServerError)
	}

	token, err := utils.GenerateJWT(newUser.ID, newUser.Email)
	if err != nil {
		return fiber.NewError(fiber.StatusInternalServerError)
	}

	return ctx.Status(fiber.StatusOK).JSON(
		utils.SendResponse(fiber.Map{"token": token, "user": newUser.ToPartialUser()}, "User account created successfully"),
	)
}

package auth

import (
	"bizMate/models"
	"bizMate/repository"
	"bizMate/utils"

	"github.com/gofiber/fiber/v2"
)

func checkAuth(ctx *fiber.Ctx) error {
	userId, _ := utils.GetUserAndWorkspaceIdsOrZero(ctx)
	pgConn, err := utils.GetPostgresDB()
	if err != nil {
		return fiber.NewError(fiber.StatusInternalServerError)
	}

	queries := repository.New(pgConn)
	user, err := queries.GetUserById(ctx.Context(), userId)
	if err != nil {
		return fiber.NewError(fiber.StatusInternalServerError)
	}

	jwtToken, err := utils.GenerateJWT(user.ID, user.Email)
	if err != nil {
		return fiber.NewError(fiber.StatusInternalServerError)
	}

	return ctx.Status(fiber.StatusOK).JSON(utils.SendResponse(jwtToken, "User authenticated successfully"))
}

func getUser(ctx *fiber.Ctx) error {
	userId, _ := utils.GetUserAndWorkspaceIdsOrZero(ctx)
	pgConn, err := utils.GetPostgresDB()
	if err != nil {
		return fiber.NewError(fiber.StatusInternalServerError)
	}

	queries := repository.New(pgConn)
	user, err := queries.GetUserById(ctx.Context(), userId)
	if err != nil {
		return fiber.NewError(fiber.StatusInternalServerError)
	}

	return ctx.Status(fiber.StatusOK).JSON(utils.SendResponse(toPartialUser(user), "User found successfully"))
}

func credentialsLogin(ctx *fiber.Ctx) error {
	reqBody := loginBodyReq{}
	if err := utils.ParseBodyAndValidate(ctx, &reqBody); err != nil {
		return fiber.NewError(fiber.StatusBadRequest, err.Error())
	}

	pgConn, err := utils.GetPostgresDB()
	if err != nil {
		return fiber.NewError(fiber.StatusInternalServerError)
	}

	queries := repository.New(pgConn)
	user, err := queries.GetUserByEmail(ctx.Context(), reqBody.Email)
	if err != nil {
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
		utils.SendResponse(fiber.Map{"token": token, "user": toPartialUser(user)}, "User logged in successfully"),
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

	id, err := utils.GenerateUuidV7()
	if err != nil {
		return fiber.NewError(fiber.StatusInternalServerError)
	}

	newUser := repository.CreateUserParams{
		Name:         reqBody.Name,
		Email:        reqBody.Email,
		Password:     password,
		Provider:     "credentials",
		Phone:        reqBody.Phone,
		ID:           id,
		Avatar:       "",
		RefreshToken: "",
	}

	pgConn, err := utils.GetPostgresDB()
	if err != nil {
		return fiber.NewError(fiber.StatusInternalServerError)
	}

	queries := repository.New(pgConn)
	user, err := queries.CreateUser(ctx.Context(), newUser)
	if err != nil {
		return fiber.NewError(fiber.StatusInternalServerError, "User account creation failed")
	}

	token, err := utils.GenerateJWT(user.ID, newUser.Email)
	if err != nil {
		return fiber.NewError(fiber.StatusInternalServerError)
	}

	return ctx.Status(fiber.StatusOK).JSON(
		utils.SendResponse(fiber.Map{"token": token, "user": toPartialUser(user)}, "User account created successfully"),
	)
}

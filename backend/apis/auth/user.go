package auth

import (
	"bizMate/repository"
	"bizMate/utils"

	"github.com/gofiber/fiber/v2"
	"github.com/google/uuid"
)

func checkAuth(ctx *fiber.Ctx) error {
	userId, _ := utils.GetUserAndWorkspaceIdsOrZero(ctx)

	var user repository.User
	user, ok := getUserFromCache(userId)
	if !ok {
		pgConn, err := utils.GetPostgresDB()
		if err != nil {
			return fiber.NewError(fiber.StatusInternalServerError)
		}

		queries := repository.New(pgConn)
		user, err = queries.GetUserById(ctx.Context(), userId)
		if err != nil {
			return fiber.NewError(fiber.StatusInternalServerError)
		}
		addUserToCache(user)
	}

	token, err := utils.GenerateJWT(user.ID, user.Email, user.Avatar)
	if err != nil {
		return fiber.NewError(fiber.StatusInternalServerError)
	}

	setTokenCookie(ctx, token)
	return ctx.Status(fiber.StatusOK).JSON(
		utils.SendResponse(fiber.Map{"user": toPartialUser(user), "token": "Bearer " + token}, "User authenticated successfully"),
	)
}

func getUser(ctx *fiber.Ctx) error {
	userId, workspaceId := utils.GetUserAndWorkspaceIdsOrZero(ctx)
	var user repository.User

	user, ok := getUserFromCache(userId)
	if ok {
		return ctx.Status(fiber.StatusOK).JSON(utils.SendResponse(toPartialUser(user), "User found successfully"))
	}

	pgConn, err := utils.GetPostgresDB()
	if err != nil {
		return fiber.NewError(fiber.StatusInternalServerError)
	}

	queries := repository.New(pgConn)
	user, err = queries.GetUserById(ctx.Context(), userId)
	if err != nil {
		utils.LogError(userId, workspaceId, user_not_found_by_id, utils.LogDataType{"error": err.Error()})
		return fiber.NewError(fiber.StatusInternalServerError)
	}

	addUserToCache(user)
	return ctx.Status(fiber.StatusOK).JSON(utils.SendResponse(toPartialUser(user), "User found successfully"))
}

func credentialsLogin(ctx *fiber.Ctx) error {
	reqBody := loginBodyReq{}
	if err := utils.ParseBodyAndValidate(ctx, &reqBody); err != nil {
		utils.LogError(uuid.Nil, uuid.Nil, login_bad_request, utils.LogDataType{"error": err.Error()})
		return fiber.NewError(fiber.StatusBadRequest, err.Error())
	}

	pgConn, err := utils.GetPostgresDB()
	if err != nil {
		return fiber.NewError(fiber.StatusInternalServerError)
	}

	queries := repository.New(pgConn)
	user, err := queries.GetUserByEmail(ctx.Context(), reqBody.Email)
	if err != nil {
		utils.LogError(uuid.Nil, uuid.Nil, user_not_found_by_email, utils.LogDataType{"error": err.Error(), "email": reqBody.Email})
		return fiber.NewError(fiber.StatusNotFound, "User not found")
	}

	addUserToCache(user)

	if user.Provider != repository.PROVIDER_CREDENTIALS {
		return fiber.NewError(fiber.StatusUnauthorized, "User not found")
	}

	if !utils.ComparePasswords(user.Password, reqBody.Password) {
		utils.LogError(user.ID, uuid.Nil, invalid_credentials_login)
		return fiber.NewError(fiber.StatusUnauthorized, "Invalid credentials")
	}

	token, err := utils.GenerateJWT(user.ID, user.Email, user.Avatar)
	if err != nil {
		return fiber.NewError(fiber.StatusInternalServerError)
	}

	setTokenCookie(ctx, token)
	utils.LogInfo(user.ID, uuid.Nil, user_login_success)
	return ctx.Status(fiber.StatusOK).JSON(
		utils.SendResponse(toPartialUser(user), "User logged in successfully"),
	)
}

func credentialsRegister(ctx *fiber.Ctx) error {
	reqBody := redisterBodyReq{}
	if err := utils.ParseBodyAndValidate(ctx, &reqBody); err != nil {
		utils.LogError(uuid.Nil, uuid.Nil, register_bad_request, utils.LogDataType{"error": err.Error()})
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
		Provider:     repository.PROVIDER_CREDENTIALS,
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
		utils.LogError(id, uuid.Nil, user_creation_failed, utils.LogDataType{"error": err.Error()})
		return fiber.NewError(fiber.StatusInternalServerError, "User account creation failed")
	}

	addUserToCache(user)
	utils.LogInfo(user.ID, uuid.Nil, user_register_success)

	token, err := utils.GenerateJWT(user.ID, newUser.Email, newUser.Avatar)
	if err != nil {
		return fiber.NewError(fiber.StatusInternalServerError)
	}

	setTokenCookie(ctx, token)
	return ctx.Status(fiber.StatusOK).JSON(
		utils.SendResponse(toPartialUser(user), "User account created successfully"),
	)
}

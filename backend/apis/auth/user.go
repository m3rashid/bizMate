package auth

import (
	"bizMate/i18n"
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
		go addUserToCache(user)
	}

	token, err := utils.GenerateJWT(user.ID, user.Email, user.Avatar)
	if err != nil {
		return fiber.NewError(fiber.StatusInternalServerError)
	}

	setTokenCookie(ctx, token)
	return ctx.Status(fiber.StatusOK).JSON(
		utils.SendResponse(fiber.Map{
			"user":  toPartialUser(user),
			"token": "Bearer " + token,
		}, i18n.ToLocalString(ctx, "User authenticated successfully")),
	)
}

func getUser(ctx *fiber.Ctx) error {
	userId, _ := utils.GetUserAndWorkspaceIdsOrZero(ctx)
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
		return fiber.NewError(fiber.StatusInternalServerError)
	}

	go addUserToCache(user)
	return ctx.Status(fiber.StatusOK).JSON(utils.SendResponse(toPartialUser(user), "User found successfully"))
}

func credentialsLogin(ctx *fiber.Ctx) error {
	reqBody := loginBodyReq{}
	if err := utils.ParseBodyAndValidate(ctx, &reqBody); err != nil {
		go utils.LogError(
			user_login,
			"",
			uuid.Nil,
			repository.UserObjectType,
			repository.LogData{"error": err.Error()},
		)
		return fiber.NewError(fiber.StatusBadRequest, err.Error())
	}

	pgConn, err := utils.GetPostgresDB()
	if err != nil {
		return fiber.NewError(fiber.StatusInternalServerError)
	}

	queries := repository.New(pgConn)
	user, err := queries.GetUserByEmail(ctx.Context(), reqBody.Email)
	if err != nil {
		go utils.LogError(
			user_login,
			reqBody.Email,
			uuid.Nil,
			repository.UserObjectType,
			repository.LogData{"error": err.Error(), "email": reqBody.Email},
		)
		return fiber.NewError(fiber.StatusNotFound, i18n.ToLocalString(ctx, "User not found"))
	}

	go addUserToCache(user)

	if user.Provider != repository.PROVIDER_CREDENTIALS {
		go utils.LogError(user_login, user.Email, uuid.Nil, repository.UserObjectType)
		return fiber.NewError(fiber.StatusUnauthorized, i18n.ToLocalString(ctx, "User not found"))
	}

	if !comparePasswords(user.Password, reqBody.Password) {
		go utils.LogError(user_login, user.Email, uuid.Nil, repository.UserObjectType)
		return fiber.NewError(fiber.StatusUnauthorized, i18n.ToLocalString(ctx, "Invalid credentials"))
	}

	token, err := utils.GenerateJWT(user.ID, user.Email, user.Avatar)
	if err != nil {
		utils.LogError(
			user_login,
			user.Email,
			uuid.Nil,
			repository.UserObjectType,
			repository.LogData{"error": err.Error()},
		)
		return fiber.NewError(fiber.StatusInternalServerError)
	}

	setTokenCookie(ctx, token)
	go utils.LogInfo(user_login, user.Email, uuid.Nil, repository.UserObjectType)
	return ctx.Status(fiber.StatusOK).JSON(
		utils.SendResponse(toPartialUser(user), i18n.ToLocalString(ctx, "User logged in successfully")),
	)
}

func credentialsRegister(ctx *fiber.Ctx) error {
	reqBody := redisterBodyReq{}
	if err := utils.ParseBodyAndValidate(ctx, &reqBody); err != nil {
		go utils.LogError(
			user_register,
			"",
			uuid.Nil,
			repository.UserObjectType,
			repository.LogData{"error": err.Error()},
		)
		return fiber.NewError(fiber.StatusBadRequest, err.Error())
	}

	password, err := hashPassword(reqBody.Password)
	if err != nil {
		go utils.LogError(
			user_register,
			reqBody.Email,
			uuid.Nil,
			repository.UserObjectType,
			repository.LogData{"error": err.Error()},
		)
		return fiber.NewError(fiber.StatusInternalServerError)
	}

	// isEmailValid := mailer.VerifyEmailValid(reqBody.Email)
	// if !isEmailValid {
	// 	go utils.LogError(
	// 		user_register,
	// 		reqBody.Email,
	// 		uuid.Nil,
	// 		repository.UserObjectType,
	// 		repository.LogData{
	// 			"error": "Invalid email",
	// 		},
	// 	)
	// 	return fiber.NewError(fiber.StatusBadRequest, "Invalid email")
	// }

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
		go utils.LogError(
			user_register,
			reqBody.Email,
			uuid.Nil,
			repository.UserObjectType,
			repository.LogData{"error": err.Error()},
		)
		return fiber.NewError(
			fiber.StatusInternalServerError,
			i18n.ToLocalString(ctx, "User account creation failed"),
		)
	}

	go addUserToCache(user)

	token, err := utils.GenerateJWT(user.ID, newUser.Email, newUser.Avatar)
	if err != nil {
		go utils.LogError(
			user_register,
			user.Email,
			uuid.Nil,
			repository.UserObjectType,
			repository.LogData{"error": err.Error()},
		)
		return fiber.NewError(fiber.StatusInternalServerError)
	}

	go utils.LogInfo(user_register, user.Email, uuid.Nil, repository.UserObjectType)
	setTokenCookie(ctx, token)
	return ctx.Status(fiber.StatusOK).JSON(
		utils.SendResponse(
			toPartialUser(user),
			i18n.ToLocalString(ctx, "User account created successfully"),
		),
	)
}

func paginateWorkspaceUsers(ctx *fiber.Ctx) error {
	_, workspaceId := utils.GetUserAndWorkspaceIdsOrZero(ctx)

	paginationRes := utils.PaginationResponse[repository.PaginateUsersInWorkspaceRow]{}
	if err := paginationRes.ParseQuery(ctx, 50); err != nil {
		return fiber.NewError(fiber.StatusBadRequest, i18n.ToLocalString(ctx, "Incorrect Parameters"))
	}

	pgConn, err := utils.GetPostgresDB()
	if err != nil {
		return fiber.NewError(fiber.StatusInternalServerError)
	}

	queries := repository.New(pgConn)
	users, err := queries.PaginateUsersInWorkspace(ctx.Context(), repository.PaginateUsersInWorkspaceParams{
		WorkspaceID: workspaceId,
		Limit:       paginationRes.Limit,
		Offset:      (paginationRes.CurrentPage - 1) * paginationRes.Limit,
	})
	if err != nil {
		return fiber.NewError(fiber.StatusInternalServerError)
	}

	paginationRes.Docs = users
	usersCount, err := queries.GetAllUsersInWorkspaceCount(ctx.Context(), workspaceId)
	if err != nil {
		return fiber.NewError(fiber.StatusInternalServerError)
	}

	paginationRes.TotalDocs = usersCount
	paginationRes.BuildPaginationResponse()

	return ctx.Status(fiber.StatusOK).JSON(
		utils.SendResponse(
			paginationRes,
			i18n.ToLocalString(ctx, "Users workspaces fetched successfully"),
		),
	)
}

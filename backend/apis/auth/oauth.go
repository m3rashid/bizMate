package auth

import (
	"bizMate/repository"
	"bizMate/utils"
	"encoding/json"
	"log"

	"github.com/gofiber/fiber/v2"
	"github.com/google/uuid"
	"github.com/shareed2k/goth_fiber"
)

func beginAuth(ctx *fiber.Ctx) error {
	return goth_fiber.BeginAuthHandler(ctx)
}

func getRedirectUrl(success bool, other ...string) string {
	url := utils.Env.AuthClientCallback + utils.Ternary(success, "?success=true", "?success=false")
	for _, str := range other {
		url = url + "&" + str
	}
	return url
}

func authCallback(ctx *fiber.Ctx) error {
	state := ctx.Query("state")
	if state == "" {
		return ctx.Redirect(getRedirectUrl(false, "error=request_forged"))
	}

	authCallbackUser, err := goth_fiber.CompleteUserAuth(ctx)
	if err != nil {
		return ctx.Redirect(getRedirectUrl(false, "error=auth_failed"))
	}

	toCreateNewUser := false

	pgConn, err := utils.GetPostgresDB()
	if err != nil {
		return ctx.Redirect(getRedirectUrl(false, "error=internal_server_error"))
	}

	queries := repository.New(pgConn)
	dbUser, err := queries.GetUserByEmail(ctx.Context(), authCallbackUser.Email)
	if err != nil {
		toCreateNewUser = true
	}

	if dbUser.ID == uuid.Nil {
		toCreateNewUser = true
	}

	if toCreateNewUser {
		id, err := utils.GenerateUuidV7()
		if err != nil {
			return ctx.Redirect(getRedirectUrl(false, "error=internal_server_error"))
		}

		_newUser := repository.CreateUserParams{
			ID:           id,
			Email:        authCallbackUser.Email,
			Password:     "",
			Name:         authCallbackUser.Name,
			Provider:     repository.PROVIDER_GOOGLE,
			RefreshToken: authCallbackUser.RefreshToken,
			Phone:        "",
			Avatar:       authCallbackUser.AvatarURL,
		}

		newUser, err := queries.CreateUser(ctx.Context(), _newUser)
		if err != nil {
			go utils.LogError(
				user_register_fail,
				authCallbackUser.Email,
				uuid.Nil,
				repository.UserObjectType,
				repository.LogData{
					"provider": "google",
					"error":    err.Error(),
				},
			)
			return ctx.Redirect(getRedirectUrl(false, "error=internal_server_error"))
		}
		go utils.LogInfo(
			user_register_success,
			authCallbackUser.Email,
			newUser.ID,
			repository.UserObjectType,
			repository.LogData{
				"provider": "google",
			},
		)
		dbUser = newUser
	}

	go addUserToCache(dbUser)
	jwtToken, err := utils.GenerateJWT(dbUser.ID, dbUser.Email, dbUser.Avatar)
	if err != nil {
		return ctx.Redirect(getRedirectUrl(false, "error=no_token"))
	}

	jsonStr, err := json.Marshal(toPartialUser(dbUser))
	if err != nil {
		return ctx.Redirect(getRedirectUrl(false, "error=internal_server_error"))
	}

	return ctx.Redirect(getRedirectUrl(true, "token=Bearer "+jwtToken, "user="+string(jsonStr)))
}

func logout(ctx *fiber.Ctx) error {
	userEmail := utils.GetUserEmailFromCtx(ctx)
	if err := goth_fiber.Logout(ctx); err != nil {
		go utils.LogError(
			user_logout_fail,
			userEmail,
			uuid.Nil,
			repository.UserObjectType,
			repository.LogData{
				"error": err.Error(),
			},
		)
		log.Fatal(err)
	}

	removeCookie(ctx)
	go utils.LogInfo(user_logout_success, userEmail, uuid.Nil, repository.UserObjectType)
	return ctx.SendStatus(fiber.StatusOK)
}

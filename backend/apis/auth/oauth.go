package auth

import (
	"bizMate/repository"
	"bizMate/utils"
	"encoding/json"
	"log"
	"os"

	"github.com/gofiber/fiber/v2"
	"github.com/google/uuid"
	"github.com/shareed2k/goth_fiber"
)

func beginAuth(ctx *fiber.Ctx) error {
	return goth_fiber.BeginAuthHandler(ctx)
}

func getRedirectUrl(success bool, other ...string) string {
	url := os.Getenv("AUTH_CLIENT_CALLBACK") + utils.Ternary(success, "?success=true", "?success=false")
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
			return ctx.Redirect(getRedirectUrl(false, "error=internal_server_error"))
		}
		dbUser = newUser
	}

	jwtToken, err := utils.GenerateJWT(dbUser.ID, dbUser.Email)
	if err != nil {
		ctx.Redirect(getRedirectUrl(false, "error=no_token"))
	}

	jsonStr, err := json.Marshal(toPartialUser(dbUser))
	if err != nil {
		return ctx.Redirect(getRedirectUrl(false, "error=internal_server_error"))
	}

	return ctx.Redirect(getRedirectUrl(true, "token="+jwtToken, "user="+string(jsonStr)))
}

func logout(ctx *fiber.Ctx) error {
	if err := goth_fiber.Logout(ctx); err != nil {
		log.Fatal(err)
	}

	return ctx.SendStatus(fiber.StatusOK)
}

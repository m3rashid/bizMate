package auth

import (
	"bizMate/models"
	"bizMate/utils"
	"encoding/json"
	"errors"
	"fmt"
	"log"
	"os"
	"strconv"
	"strings"

	"github.com/gofiber/fiber/v2"
	"github.com/shareed2k/goth_fiber"
	"gorm.io/gorm"
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

// If the user signs up with google for the first time (without an invite), it is good
// but to accept the invite, the user must sign up with the credentials flow
func authCallback(ctx *fiber.Ctx) error {
	state := ctx.Query("state")
	if state == "" {
		return ctx.Redirect(getRedirectUrl(false, "error=request_forged"))
	}

	user, err := goth_fiber.CompleteUserAuth(ctx)
	if err != nil {
		return ctx.Redirect(getRedirectUrl(false, "error=auth_failed"))
	}

	inviteId := uint(0)
	if strings.Contains(state, "inviteId-") {
		str := strings.SplitAfter(state, "inviteId-")
		fmt.Printf("\nstr: %s\n", str)
		inviteIdU64, err := strconv.ParseUint(str[1], 10, 32)
		if err != nil || inviteIdU64 == 0 {
			return ctx.Redirect(getRedirectUrl(false, "error=bad_request"))
		}

		inviteId = uint(inviteIdU64)
	}

	existingUser := models.User{}
	if inviteId != 0 {
		// if it has inviteId => create a new user in the invite-id's workspace
		newUser, err := handleInvite(inviteId, models.InviteAccepted, models.PROVIDER_GOOGLE, user.RefreshToken)
		if err != nil {
			return ctx.Redirect(getRedirectUrl(false, "error=internal_server_error"))
		}
		existingUser = *newUser
	} else {
		// if the control reaches here, it can mean one of two cases
		// - the user is signing up for the first time on its own
		// - the user is signing in to an existing account

		db, err := utils.GetDB()
		if err != nil {
			return ctx.Redirect(getRedirectUrl(false, "error=internal_server_error"))
		}

		if err = db.Where("email = ?", user.Email).First(&existingUser).Error; err != nil {
			if errors.Is(err, gorm.ErrRecordNotFound) {
				fmt.Println("Creating a new user")
				newUser, err := createNewUser(user.Name, user.Email, "", "", 0, models.PROVIDER_GOOGLE, user.RefreshToken)
				if err != nil {
					return ctx.Redirect(getRedirectUrl(false, "error=internal_server_error"))
				}
				existingUser = *newUser
			} else {
				return ctx.Redirect(getRedirectUrl(false, "error=internal_server_error"))
			}
		}

		if existingUser.ID == 0 {
			fmt.Println("Creating a new user")
			newUser, err := createNewUser(user.Name, user.Email, "", "", 0, models.PROVIDER_GOOGLE, user.RefreshToken)
			if err != nil {
				return ctx.Redirect(getRedirectUrl(false, "error=internal_server_error"))
			}
			existingUser = *newUser
		}
	}

	jwtToken, err := utils.GenerateJWT(existingUser.ID, existingUser.WorkspaceID, existingUser.Email)
	if err != nil {
		ctx.Redirect(getRedirectUrl(false, "error=no_token"))
	}

	jsonStr, err := json.Marshal(existingUser.ToPartialUser())
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

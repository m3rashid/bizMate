package auth

import (
	"bizMate/models"
	"bizMate/utils"
	"encoding/json"
	"errors"
	"log"
	"os"
	"strings"

	"github.com/gofiber/fiber/v2"
	"github.com/google/uuid"
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

func authCallback(ctx *fiber.Ctx) error {
	state := ctx.Query("state")
	if state == "" {
		return ctx.Redirect(getRedirectUrl(false, "error=request_forged"))
	}

	authCallbackUser, err := goth_fiber.CompleteUserAuth(ctx)
	if err != nil {
		return ctx.Redirect(getRedirectUrl(false, "error=auth_failed"))
	}

	inviteId := uuid.Nil
	if strings.Contains(state, "inviteId-") {
		str := strings.SplitAfter(state, "inviteId-")
		inviteIdUuid, err := uuid.Parse(str[1])
		if err != nil {
			return ctx.Redirect(getRedirectUrl(false, "error=bad_request"))
		}
		inviteId = inviteIdUuid
	}

	db, err := utils.GetDB()
	if err != nil {
		return ctx.Redirect(getRedirectUrl(false, "error=internal_server_error"))
	}

	toCreateNewUser := false
	user := models.User{}

	if err = db.Where("email = ?", authCallbackUser.Email).First(&user).Error; err != nil {
		if errors.Is(err, gorm.ErrRecordNotFound) {
			toCreateNewUser = true
		} else {
			return ctx.Redirect(getRedirectUrl(false, "error=internal_server_error"))
		}
	}

	if user.ID == "" {
		toCreateNewUser = true
	}

	if toCreateNewUser { // create user
		newUser := models.User{
			Name:         authCallbackUser.Name,
			Email:        authCallbackUser.Email,
			RefreshToken: authCallbackUser.RefreshToken,
			Provider:     models.PROVIDER_GOOGLE,
		}

		if err := db.Create(&newUser).Error; err != nil {
			return ctx.Redirect(getRedirectUrl(false, "error=internal_server_error"))
		}

		user = newUser
	}

	if inviteId != uuid.Nil {
		invite := models.UserInvite{}
		if err := db.Where("id = ?", inviteId.String()).First(&invite).Error; err != nil {
			return ctx.Redirect(getRedirectUrl(true, "error=invalid_invite_id"))
		}

		if invite.ID == "" || invite.Status != models.InvitePending {
			return ctx.Redirect(getRedirectUrl(true, "error=invalid_invite_status"))
		}

		err := db.Transaction(func(tx *gorm.DB) error {
			invite.Status = models.InviteAccepted
			if err := tx.Save(&invite).Error; err != nil {
				return err
			}

			workspace := models.Workspace{}
			if err := tx.Where("id = ?", invite.WorkspaceID).First(&workspace).Error; err != nil {
				return err
			}

			workspace.Users = append(workspace.Users, &user)
			if err := tx.Save(&workspace).Error; err != nil {
				return err
			}

			return nil
		})

		if err != nil {
			return ctx.Redirect(getRedirectUrl(true, "error=not_added_to_workspace"))
		}
	}

	jwtToken, err := utils.GenerateJWT(user.ID, user.Email)
	if err != nil {
		ctx.Redirect(getRedirectUrl(false, "error=no_token"))
	}

	jsonStr, err := json.Marshal(user.ToPartialUser())
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

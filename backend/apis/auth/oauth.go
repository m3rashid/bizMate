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

	user, err := goth_fiber.CompleteUserAuth(ctx)
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
	existingUser := models.User{}
	otherTxs := []func(*gorm.DB, *models.User) error{}

	if err = db.Where("email = ?", user.Email).First(&existingUser).Error; err != nil {
		if errors.Is(err, gorm.ErrRecordNotFound) {
			toCreateNewUser = true
		} else {
			return ctx.Redirect(getRedirectUrl(false, "error=internal_server_error"))
		}
	}

	if existingUser.ID == "" {
		toCreateNewUser = true
	}

	if inviteId != uuid.Nil {
		// TODO: [CASE_NOT_HANDLED] invite Id can also come to existing users

		invite := models.UserInvite{}
		if err := db.Where("id = ?", inviteId.String()).First(&invite).Error; err != nil {
			return ctx.Redirect(getRedirectUrl(false, "error=internal_server_error"))
		}

		if invite.Status != models.InvitePending {
			return ctx.Redirect(getRedirectUrl(false, "error=internal_server_error"))
		}

		toCreateNewUser = true
		otherTxs = append(otherTxs, func(tx *gorm.DB, user *models.User) error { // set the invite status to accepted
			invite.Status = models.InviteAccepted
			return tx.Save(&invite).Error
		})

		otherTxs = append(otherTxs, func(tx *gorm.DB, user *models.User) error { // add user to the workspace
			workspace := models.Workspace{}
			if err := tx.Where("id = ?", invite.WorkspaceID).First(&workspace).Error; err != nil {
				return err
			}

			workspace.Users = append(workspace.Users, user)
			return tx.Save(&workspace).Error
		})
	}

	newUser := models.User{
		Name:         user.Name,
		Email:        user.Email,
		RefreshToken: user.RefreshToken,
		Provider:     models.PROVIDER_GOOGLE,
	}

	if toCreateNewUser {
		if err := createUserFromOauth(db, &newUser, otherTxs...); err != nil {
			return ctx.Redirect(getRedirectUrl(false, "error=internal_server_error"))
		}
	}

	jwtToken, err := utils.GenerateJWT(newUser.ID, newUser.Email)
	if err != nil {
		ctx.Redirect(getRedirectUrl(false, "error=no_token"))
	}

	jsonStr, err := json.Marshal(newUser.ToPartialUser())
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

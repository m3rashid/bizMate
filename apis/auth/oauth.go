package auth

import (
	"bizmate/models"
	"bizmate/utils"
	"errors"
	"fmt"
	"log"
	"os"

	"github.com/gofiber/fiber/v2"
	"github.com/shareed2k/goth_fiber"
	"gorm.io/gorm"
)

func beginAuth(ctx *fiber.Ctx) error {
	return goth_fiber.BeginAuthHandler(ctx)
}

func getRedirectUrl(success bool, other ...string) string {
	url := os.Getenv("AUTH_CLIENT_CALLBACK") + utils.Conditional("?success=true", "?success=false", success)
	for _, str := range other {
		url = url + "&" + str
	}
	return url
}

func authCallback(ctx *fiber.Ctx) error {
	tenantUrl := ctx.Query("state")
	fmt.Println(ctx.Queries())
	if tenantUrl == "" {
		return ctx.Redirect(getRedirectUrl(false, "error=request_forged"))
	}

	user, err := goth_fiber.CompleteUserAuth(ctx)
	if err != nil {
		return ctx.Redirect(getRedirectUrl(false, "error=auth_failed"))
	}

	db, err := utils.GetTenantDBFromTenantUrl(tenantUrl)
	if err != nil {
		return ctx.Redirect(getRedirectUrl(false, "error=tenant_not_found"))
	}

	existingUser := models.User{}
	createUser := func() error {
		newUser := models.User{
			Name:         user.Name,
			Email:        user.Email,
			Avatar:       user.AvatarURL,
			Provider:     models.PROVIDER_GOOGLE,
			Password:     "",
			RefreshToken: user.RefreshToken,
		}

		if err = db.Create(&newUser).Error; err != nil {
			fmt.Println(err)
			return errors.New("error=cant_create_user")
		}

		existingUser = newUser
		return nil
	}

	if err = db.Where("email = ?", user.Email).First(&existingUser).Error; err != nil {
		if errors.Is(err, gorm.ErrRecordNotFound) {
			createUser()
		} else {
			return ctx.Redirect(getRedirectUrl(false, "error=internal_server_error"))
		}
	}

	if existingUser.ID == 0 { // create user account
		createUser()
	}

	jwtToken, err := utils.GenerateJWT(existingUser.ID, existingUser.Email)
	if err != nil {
		ctx.Redirect(getRedirectUrl(false, "error=no_token"))
	}

	return ctx.Redirect(getRedirectUrl(true, "token="+jwtToken))
}

func logout(ctx *fiber.Ctx) error {
	if err := goth_fiber.Logout(ctx); err != nil {
		log.Fatal(err)
	}

	return ctx.SendString("logout")
}

func checkAuth(ctx *fiber.Ctx) error {
	jwtToken, err := utils.GenerateJWT(ctx.Locals("userId").(uint), ctx.Locals("email").(string))
	if err != nil {
		return ctx.SendStatus(fiber.StatusInternalServerError)
	}

	return ctx.JSON(fiber.Map{"token": jwtToken})
}

package auth

import (
	"bizMate/utils"
	"os"
	"time"

	"github.com/gofiber/fiber/v2"
	"github.com/gofiber/fiber/v2/middleware/session"
	"github.com/gofiber/storage/memory"
	"github.com/google/uuid"
	"github.com/markbates/goth"
	"github.com/markbates/goth/providers/google"
	"github.com/shareed2k/goth_fiber"
)

func Setup(initialRoute string, app *fiber.App) {
	googleOauthClientId := os.Getenv("GOOGLE_OAUTH_CLIENT_ID")
	googleOauthClientSecret := os.Getenv("GOOGLE_OAUTH_CLIENT_SECRET")
	googleOauthCallbackUrl := os.Getenv("GOOGLE_OAUTH_CALLBACK_URL")

	goth_fiber.SessionStore = session.New(session.Config{
		CookiePath:     "/",
		CookieHTTPOnly: true,
		CookieSameSite: "Lax",
		Storage:        memory.New(),
		Expiration:     30 * time.Minute,
		KeyGenerator:   uuid.New().String,
		CookieSecure:   os.Getenv("SERVER_MODE") == "production",
	})

	goth.UseProviders(google.New(googleOauthClientId, googleOauthClientSecret, googleOauthCallbackUrl))
	app.Get(initialRoute+"/user", utils.CheckAuthMiddlewareWithoutWorkspace, getUser)
	app.Get(initialRoute+"/check", utils.CheckAuthMiddlewareWithWorkspace, checkAuth)
	app.Post(initialRoute+"/login", credentialsLogin)
	app.Post(initialRoute+"/register", credentialsRegister)
	app.Get(initialRoute+"/logout", logout)
	app.Get(initialRoute+"/workspaces", utils.CheckAuthMiddlewareWithoutWorkspace, getWorkspaces)
	app.Post(initialRoute+"/workspaces/create", utils.CheckAuthMiddlewareWithoutWorkspace, createWorkspace)
	app.Get(initialRoute+"/:provider", beginAuth)
	app.Get(initialRoute+"/:provider/callback", authCallback)
}

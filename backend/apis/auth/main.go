package auth

import (
	"bizMate/controllers"
	"bizMate/models"
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
	sessions := session.New(session.Config{
		Expiration:     30 * time.Minute,
		Storage:        memory.New(),
		CookiePath:     "/",
		CookieSecure:   os.Getenv("SERVER_MODE") == "production",
		CookieHTTPOnly: true, // Should always be enabled
		CookieSameSite: "Lax",
		KeyGenerator:   uuid.New().String,
	})
	goth_fiber.SessionStore = sessions

	goth.UseProviders(
		google.New(
			os.Getenv("GOOGLE_OAUTH_CLIENT_ID"),
			os.Getenv("GOOGLE_OAUTH_CLIENT_SECRET"),
			os.Getenv("GOOGLE_OAUTH_CALLBACK_URL"),
		),
	)

	app.Get(initialRoute+"/user", utils.CheckAuthMiddleware, getUser)
	app.Get(initialRoute+"/check", utils.CheckAuthMiddleware, checkAuth)
	app.Post(initialRoute+"/login", credentialsLogin)
	app.Post(initialRoute+"/register", credentialsRegister)
	app.Get(initialRoute+"/logout", logout)
	app.Get(initialRoute+"/workspaces", utils.CheckAuthMiddleware, getWorkspaces)
	app.Get(initialRoute+"/:provider", beginAuth)
	app.Get(initialRoute+"/:provider/callback", authCallback)

	app.Get(initialRoute+"/users/all", utils.CheckAuthMiddleware, controllers.Paginate[models.User]())
}

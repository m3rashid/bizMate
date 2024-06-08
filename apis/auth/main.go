package auth

import (
	"bizmate/controllers"
	"bizmate/models"
	"bizmate/utils"
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

func Setup(app *fiber.App) {
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

	app.Get("/auth/user", utils.CheckAuthMiddleware, getUser)
	app.Get("/auth/check", utils.CheckAuthMiddleware, checkAuth)
	app.Post("/auth/login", credentialsLogin)
	app.Post("/auth/register", credentialsRegister)

	app.Get("/users/all", utils.CheckAuthMiddleware, controllers.Paginate[models.User]())

	app.Get("/auth/:provider", beginAuth)
	app.Get("/auth/:provider/callback", authCallback)
	app.Get("/auth/logout", logout)
}

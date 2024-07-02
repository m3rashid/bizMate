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
	googleOauthClientId := os.Getenv("GOOGLE_OAUTH_CLIENT_ID")
	googleOauthClientSecret := os.Getenv("GOOGLE_OAUTH_CLIENT_SECRET")
	googleOauthCallbackUrl := os.Getenv("GOOGLE_OAUTH_CALLBACK_URL")

	sessionStore := session.New(session.Config{
		Expiration:     30 * time.Minute,
		Storage:        memory.New(),
		CookiePath:     "/",
		CookieSecure:   os.Getenv("SERVER_MODE") == "production",
		CookieHTTPOnly: true, // Should always be enabled
		CookieSameSite: "Lax",
		KeyGenerator:   uuid.New().String,
	})
	goth_fiber.SessionStore = sessionStore

	goth.UseProviders(google.New(googleOauthClientId, googleOauthClientSecret, googleOauthCallbackUrl))
	app.Get(initialRoute+"/user", utils.CheckAuthMiddlewareWithoutWorkspace, getUser)
	app.Get(initialRoute+"/check", utils.CheckAuthMiddlewareWithWorkspace, checkAuth)
	app.Post(initialRoute+"/login", credentialsLogin)
	app.Post(initialRoute+"/register", credentialsRegister)
	app.Get(initialRoute+"/logout", logout)
	app.Get(initialRoute+"/workspaces", utils.CheckAuthMiddlewareWithoutWorkspace, getWorkspaces)
	app.Post(initialRoute+"/workspaces/create", utils.CheckAuthMiddlewareWithoutWorkspace, controllers.Create(models.WORKSPACE_MODEL_NAME, controllers.CreateOptions[createWorkspaceReq, models.Workspace]{
		GetDefaultValues: func(values *createWorkspaceReq, ctx *fiber.Ctx) (*models.Workspace, error) {
			userId, _ := utils.GetUserAndWorkspaceIdsOrZero(ctx)
			return &models.Workspace{
				Name:      values.Name,
				CreatedBy: models.CreatedBy{CreatedByID: userId.String()},
			}, nil
		},
	}))
	app.Get(initialRoute+"/:provider", beginAuth)
	app.Get(initialRoute+"/:provider/callback", authCallback)

	app.Get(initialRoute+"/users/all", utils.CheckAuthMiddlewareWithWorkspace, controllers.Paginate[models.User]())
}

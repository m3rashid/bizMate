package auth

import (
	"bizMate/apis/permissions"
	"bizMate/repository"
	"bizMate/utils"
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
	goth_fiber.SessionStore = session.New(session.Config{
		CookiePath:     "/",
		CookieHTTPOnly: true,
		CookieSameSite: "Lax",
		Storage:        memory.New(),
		Expiration:     30 * time.Minute,
		KeyGenerator:   uuid.New().String,
		CookieSecure:   *utils.Env.IsProduction,
	})

	goth.UseProviders(
		google.New(
			utils.Env.GoogleOauthClientId,
			utils.Env.GoogleOauthClientSecret,
			utils.Env.GoogleOauthCallbackUrl,
		),
	)

	app.Get(initialRoute+"/user", utils.CheckAuthMiddlewareWithoutWorkspace, getUser)
	app.Get(initialRoute+"/check", utils.CheckAuthMiddlewareWithWorkspace, checkAuth)

	app.Get(initialRoute+"/logout", logout)
	app.Post(initialRoute+"/login", credentialsLogin)
	app.Post(initialRoute+"/register", credentialsRegister)

	app.Get(initialRoute+"/workspaces", utils.CheckAuthMiddlewareWithoutWorkspace, getWorkspaces)
	app.Get(initialRoute+"/:workspaceId/check-workspace", utils.CheckAuthMiddlewareWithoutWorkspace, checkWorkspace)
	app.Post(initialRoute+"/workspaces/create", utils.CheckAuthMiddlewareWithoutWorkspace, createWorkspace)

	app.Get(initialRoute+"/:provider", beginAuth)
	app.Get(initialRoute+"/:provider/callback", authCallback)

	app.Post(initialRoute+"/invites/respond", utils.CheckAuthMiddlewareWithoutWorkspace, acceptOrRejectWorkspaceInvite)

	app.Post(
		initialRoute+"/:workspaceId/invites/send",
		utils.CheckAuthMiddlewareWithWorkspace,
		permissions.CheckPermissionMiddleware(repository.WorkspaceInviteObjectType, repository.PermissionLevelCreate),
		sendWorkspaceInvite,
	)

	app.Post(
		initialRoute+"/:workspaceId/invites/revoke",
		utils.CheckAuthMiddlewareWithWorkspace,
		permissions.CheckPermissionMiddleware(repository.WorkspaceInviteObjectType, repository.PermissionLevelDelete),
		revokeWorkspaceInvite,
	)

	app.Get(initialRoute+"/invites/all", utils.CheckAuthMiddlewareWithoutWorkspace, getWorkspaceInvites)

	app.Get(
		initialRoute+"/:workspaceId/users/all",
		utils.CheckAuthMiddlewareWithWorkspace,
		permissions.CheckPermissionMiddleware(repository.UserObjectType, repository.PermissionLevelRead),
		paginateWorkspaceUsers,
	)
}

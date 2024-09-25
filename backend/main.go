package main

import (
	"bizMate/apis/activity"
	"bizMate/apis/auth"
	"bizMate/apis/calendar"
	"bizMate/apis/dashboard"
	"bizMate/apis/export"
	"bizMate/apis/forms"
	"bizMate/apis/payments"
	"bizMate/apis/permissions"
	"bizMate/utils"
	"log"
	"os"
	"strings"

	"github.com/gofiber/contrib/fiberi18n/v2"
	"github.com/gofiber/fiber/v2"
	"github.com/gofiber/fiber/v2/middleware/cors"
	"github.com/gofiber/fiber/v2/middleware/favicon"
	"github.com/gofiber/fiber/v2/middleware/limiter"
	"github.com/gofiber/fiber/v2/middleware/logger"
	"github.com/gofiber/fiber/v2/middleware/recover"
)

func init() {
	isTestEnvironment := strings.HasSuffix(os.Args[0], ".test")
	if isTestEnvironment { // we are in a testing environment
		return
	}

	utils.SetupEnv()
}

func main() {
	server, err := utils.NewServer()
	if err != nil {
		log.Fatal(err)
	}

	app := fiber.New(server.AppConfig)
	app.Use(recover.New())
	app.Use(cors.New(server.CorsConfig))
	app.Static("/public", server.PublicFolderConfig.Path, server.PublicFolderConfig.Config)
	app.Use(favicon.New(server.FaviconConfig))
	app.Use(limiter.New(server.RateLimitConfig))
	app.Use(fiberi18n.New(&server.I18nConfig))
	app.Use(logger.New())

	utils.InitLogsLocalPubSub()

	app.Get("/api", func(ctx *fiber.Ctx) error {
		return ctx.SendString(utils.TranslateToLocalLanguage(ctx, "Hello, World!"))
	})

	auth.Setup("/api/auth", app)
	export.Setup("/api/:workspaceId/export", app)
	forms.Setup("/api/:workspaceId/forms", app)
	payments.Setup("/api/:workspaceId/payments", app)
	permissions.Setup("/api/:workspaceId/permissions", app)
	activity.Setup("/api/:workspaceId/activity", app)
	calendar.Setup("/api/:workspaceId/calendar", app)
	dashboard.Setup("/api/:workspaceId/dashboard", app)

	log.Println("Server is running in "+utils.Env.ServerMode+" mode on port:", utils.Env.Port)
	app.Listen(":" + utils.Env.Port)
}

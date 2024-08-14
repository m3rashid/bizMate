package main

import (
	"bizMate/apis/auth"
	"bizMate/apis/contacts"
	"bizMate/apis/dashboards"
	"bizMate/apis/drive"
	"bizMate/apis/export"
	"bizMate/apis/forms"
	"bizMate/apis/notifications"
	"bizMate/apis/payments"
	"bizMate/apis/projects"
	"bizMate/apis/seed"
	"bizMate/utils"
	"log"
	"os"
	"strings"
	"time"

	"github.com/gofiber/contrib/fiberi18n/v2"
	"github.com/gofiber/fiber/v2"
	"github.com/gofiber/fiber/v2/middleware/cors"
	"github.com/gofiber/fiber/v2/middleware/favicon"
	"github.com/gofiber/fiber/v2/middleware/limiter"
	"github.com/gofiber/fiber/v2/middleware/logger"
	"golang.org/x/text/language"
)

func init() {
	isTestEnvironment := strings.HasSuffix(os.Args[0], ".test")
	if isTestEnvironment { // we are in a testing environment
		return
	}

	utils.SetupEnv()
}

func main() {
	app := fiber.New(fiber.Config{
		CaseSensitive:         true,
		PassLocalsToViews:     true,
		AppName:               utils.Env.AppName,
		RequestMethods:        []string{"GET", "POST", "HEAD", "OPTIONS"},
		Concurrency:           256 * 1024 * 1024,
		ServerHeader:          utils.Env.AppName,
		DisableStartupMessage: true,
		ErrorHandler: func(ctx *fiber.Ctx, err error) error {
			code := fiber.StatusInternalServerError
			if e, ok := err.(*fiber.Error); ok {
				code = e.Code
			}
			return ctx.Status(code).JSON(fiber.Map{
				"data":    nil,
				"success": false,
				"message": utils.Ternary(err.Error() != "", err.Error(), "Something went wrong!"),
			})
		},
	})

	app.Use(cors.New(cors.Config{
		AllowCredentials: true,
		AllowOrigins:     utils.Ternary(*utils.Env.IsProduction, "https://bizmate.m3rashid.in", "http://localhost:3000"),
	}))

	app.Static("/public", "./public", fiber.Static{
		MaxAge:        3600,
		CacheDuration: 10 * time.Second,
	})

	app.Use(favicon.New(favicon.Config{
		URL:  "/favicon.ico",
		File: "./public/icons/favicon.ico",
	}))

	if *utils.Env.IsProduction {
		app.Use(limiter.New(limiter.Config{
			Max:               100,
			Expiration:        1 * time.Minute,
			LimiterMiddleware: limiter.SlidingWindow{},
		}))
	}

	app.Use(
		fiberi18n.New(&fiberi18n.Config{
			FormatBundleFile: "json",
			RootPath:         "./i18n",
			DefaultLanguage:  language.English,
			AcceptLanguages:  []language.Tag{language.English, language.Hindi},
		}),
	)

	utils.InitLogsLocalPubSub()

	app.Get("/", func(ctx *fiber.Ctx) error {
		return ctx.SendString(utils.TranslateToLocalLanguage(ctx, "Hello, World!"))
	})

	if !*utils.Env.IsProduction {
		app.Use(logger.New())
	}

	auth.Setup("/auth", app)
	contacts.Setup("/:workspaceId/contacts", app)
	dashboards.Setup("/:workspaceId/dashboards", app)
	drive.Setup("/:workspaceId/drive", app)
	export.Setup("/:workspaceId/export", app)
	forms.Setup("/:workspaceId/forms", app)
	notifications.Setup("/:workspaceId/notifications", app)
	payments.Setup("/:workspaceId/payments", app)
	projects.Setup("/:workspaceId/projects", app)

	if !*utils.Env.IsProduction {
		seed.Setup("/seed", app)
	}

	log.Println("Server is running in "+utils.Env.ServerMode+" mode on port:", utils.Env.Port)
	app.Listen(":" + utils.Env.Port)
}

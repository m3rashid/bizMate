package main

import (
	"bizMate/apis/auth"
	"bizMate/apis/automations"
	"bizMate/apis/contacts"
	"bizMate/apis/dashboard"
	"bizMate/apis/drive"
	"bizMate/apis/export"
	"bizMate/apis/forms"
	"bizMate/apis/host"
	"bizMate/apis/notifications"
	"bizMate/apis/payments"
	"bizMate/apis/project"
	"bizMate/apis/seed"
	"bizMate/models"
	"bizMate/utils"
	"log"
	"os"
	"strings"
	"time"

	"github.com/gofiber/fiber/v2"
	"github.com/gofiber/fiber/v2/middleware/cors"
	"github.com/gofiber/fiber/v2/middleware/favicon"
	"github.com/gofiber/fiber/v2/middleware/limiter"
	"github.com/gofiber/fiber/v2/middleware/logger"
	"github.com/joho/godotenv"
)

func init() {
	isTestEnvironment := strings.HasSuffix(os.Args[0], ".test")
	if isTestEnvironment { // we are in a testing environment
		return
	}

	err := godotenv.Load(".env")
	if err != nil {
		log.Fatal("Error loading .env file")
	}
}

func main() {
	app := fiber.New(fiber.Config{
		CaseSensitive:         true,
		PassLocalsToViews:     true,
		AppName:               os.Getenv("APP_NAME"),
		RequestMethods:        []string{"GET", "POST", "HEAD", "OPTIONS"},
		Concurrency:           256 * 1024 * 1024,
		ServerHeader:          os.Getenv("APP_NAME"),
		DisableStartupMessage: true,
		ErrorHandler: func(ctx *fiber.Ctx, err error) error {
			code := fiber.StatusInternalServerError
			if e, ok := err.(*fiber.Error); ok {
				code = e.Code
			}
			return ctx.SendStatus(code)
		},
	})

	app.Use(cors.New(cors.Config{
		AllowOrigins:     "http://localhost:5173",
		AllowCredentials: true,
	}))

	app.Static("/public", "./public", fiber.Static{
		MaxAge:        3600,
		CacheDuration: 10 * time.Second,
	})

	app.Use(favicon.New(favicon.Config{
		File: "./public/icons/favicon.ico",
		URL:  "/favicon.ico",
	}))

	if os.Getenv("SERVER_MODE") == "production" {
		app.Use(limiter.New(limiter.Config{
			Max:               100,
			Expiration:        1 * time.Minute,
			LimiterMiddleware: limiter.SlidingWindow{},
		}))
	}

	app.Get("/", func(c *fiber.Ctx) error {
		return c.SendString("Hello, World!")
	})

	utils.MigrateModels(models.AllModels)
	if os.Getenv("SERVER_MODE") == "development" {
		app.Use(logger.New())
	}

	auth.Setup(app)
	automations.Setup(app)
	contacts.Setup(app)
	dashboard.Setup(app)
	drive.Setup(app)
	export.Setup(app)
	forms.Setup(app)
	host.Setup(app)
	notifications.Setup(app)
	payments.Setup(app)
	project.Setup(app)

	if os.Getenv("SERVER_MODE") == "development" {
		seed.Setup(app)
	}

	log.Println("Server is running in " + os.Getenv("SERVER_MODE") + " mode.")
	app.Listen(":4000")
}

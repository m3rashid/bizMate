package main

import (
	"bizmate/apis/dashboard"
	"bizmate/apis/forms"
	"bizmate/auth"
	"bizmate/models"
	"bizmate/notifications"
	"bizmate/payments"
	"bizmate/scripts"
	"bizmate/utils"
	"fmt"
	"log"
	"os"
	"time"

	"github.com/gofiber/fiber/v2"
	"github.com/gofiber/fiber/v2/middleware/cors"
	"github.com/gofiber/fiber/v2/middleware/favicon"
	"github.com/gofiber/fiber/v2/middleware/limiter"
	"github.com/gofiber/fiber/v2/middleware/logger"
	"github.com/joho/godotenv"
)

func init() {
	err := godotenv.Load(".env")
	if err != nil {
		log.Fatal("Error loading .env file")
	}
	fmt.Println("Environment Variables Loaded")
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
			return ctx.Status(code).JSON(fiber.Map{"success": false, "message": err.Error()})
		},
	})

	app.Use(cors.New(cors.Config{
		AllowOrigins:     "http://localhost:5173",
		AllowCredentials: true,
	}))

	utils.TenantModels = []interface{}{
		models.User{},
		models.Profile{},

		models.Notification{},

		models.Form{},
		models.FormResponse{},

		models.Kpi{},
		models.Widget{},
		models.Dashboard{},
	}

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

	db := utils.GetHostDB()
	utils.GormMigrate(db, []interface{}{&models.Tenant{}, &models.TenantOwner{}})
	if os.Getenv("SERVER_MODE") == "development" {
		app.Use(logger.New())
		db.Logger.LogMode(3)
	}

	auth.Setup(app)
	forms.Setup(app)
	scripts.Setup(app)
	payments.Setup(app)
	dashboard.Setup(app)
	notifications.Setup(app)

	log.Println("Server is running in " + os.Getenv("SERVER_MODE") + " mode.")
	app.Listen(":" + os.Getenv("SERVER_PORT"))
}

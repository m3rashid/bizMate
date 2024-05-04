package main

import (
	"bizmate/auth"
	"bizmate/models"
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

	// app.Use(func(ctx *fiber.Ctx) error {
	// 	fmt.Println("Middleware intercept")
	// 	fmt.Println("queries: ", ctx.Queries())
	// 	fmt.Println("params: ", ctx.AllParams())
	// 	return ctx.Next()
	// })

	utils.TenantModels = []interface{}{
		models.User{},
		models.Profile{},
	}

	auth.Setup(app)
	scripts.Setup(app)

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

	if os.Getenv("SERVER_MODE") == "development" {
		app.Use(logger.New(logger.Config{
			Format: "${time} ${status} ${latency} ${method} ${path} ${body} ${query}\n",
		}))
	}

	db := utils.GetHostDB()
	utils.GormMigrate(db, []interface{}{&models.Tenant{}, &models.TenantOwner{}})

	log.Println("Server is running in " + os.Getenv("SERVER_MODE") + " mode.")
	app.Listen(":" + os.Getenv("SERVER_PORT"))
}

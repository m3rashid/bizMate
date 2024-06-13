package main

import (
	"bizmate/apis/auth"
	"bizmate/apis/contacts"
	"bizmate/apis/dashboard"
	"bizmate/apis/export"
	"bizmate/apis/forms"
	"bizmate/apis/notifications"
	"bizmate/apis/payments"
	"bizmate/apis/project"
	"bizmate/apis/workflows"
	"bizmate/models"
	"bizmate/scripts"
	"bizmate/utils"
	"fmt"
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

		models.EmailTemplate{},
		models.BulkEmailRequest{},
		models.WebUiNotification{},

		models.Form{},
		models.FormResponse{},

		models.Kpi{},
		models.Widget{},
		models.Dashboard{},

		models.ProjectTag{},
		models.ProjectTask{},
		models.Project{},
		models.ProjectTaskComment{},

		models.Contact{},

		models.Workflow{},
		models.WorkflowStep{},
		models.WorkflowExectionLog{},
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
	export.Setup(app)
	project.Setup(app)
	scripts.Setup(app)
	payments.Setup(app)
	contacts.Setup(app)
	dashboard.Setup(app)
	workflows.Setup(app)
	notifications.Setup(app)

	log.Println("Server is running in " + os.Getenv("SERVER_MODE") + " mode.")
	app.Listen(":" + os.Getenv("SERVER_PORT"))
}

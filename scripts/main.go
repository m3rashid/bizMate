package scripts

import (
	"os"

	"github.com/gofiber/fiber/v2"
)

func Setup(app *fiber.App) {
	if os.Getenv("SERVER_MODE") == "production" {
		return
	}

	app.Post("/dev/create-tenant", createTenantHandler)
}

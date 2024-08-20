package upload

import "github.com/gofiber/fiber/v2"

func Setup(initialRoute string, app *fiber.App) {
	app.Get(initialRoute+"/put-presign-url", getPutPresignUrl)
	app.Get(initialRoute+"/get-presign-url", getGetPresignUrl)
}

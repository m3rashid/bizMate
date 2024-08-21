package upload

import "github.com/gofiber/fiber/v2"

func getPutPresignUrl(c *fiber.Ctx) error {
	return c.SendString("PutPresignUrl")
}

func getGetPresignUrl(c *fiber.Ctx) error {
	return c.SendString("GetPresignUrl")
}

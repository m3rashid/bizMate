package utils

import (
	"github.com/gofiber/contrib/fiberi18n/v2"
	"github.com/gofiber/fiber/v2"
)

func TranslateToLocalLanguage(ctx *fiber.Ctx, key string) string {
	localize, err := fiberi18n.Localize(ctx, key)
	if err != nil {
		return key
	}
	return localize
}

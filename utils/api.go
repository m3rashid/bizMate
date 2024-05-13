package utils

import (
	"github.com/go-playground/validator/v10"
	"github.com/gofiber/fiber/v2"
)

func ParseBodyAndValidate[T interface{}](ctx *fiber.Ctx, str *T) error {
	if err := ctx.BodyParser(str); err != nil {
		return err
	}

	validate := validator.New()
	if err := validate.Struct(str); err != nil {
		return err
	}

	return nil
}

func GetDeviceIP(ctx *fiber.Ctx) string {
	return ctx.Get("X-Forwarded-For")
}

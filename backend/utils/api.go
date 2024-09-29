package utils

import (
	"fmt"

	"github.com/go-playground/validator/v10"
	"github.com/gofiber/fiber/v2"
)

func ParseBodyAndValidate[T interface{}](ctx *fiber.Ctx, str *T) error {
	if err := ctx.BodyParser(str); err != nil {
		fmt.Println(err)
		return err
	}

	validate := validator.New()
	if err := validate.Struct(str); err != nil {
		return err
	}

	return nil
}

func GetDeviceIP(ctx *fiber.Ctx) string {
	// https://api.ipify.org/?format=json
	// use this api to get the ip address of the device from the client side
	return ctx.Get("X-Forwarded-For")
}

func SendResponse(data interface{}, msg string) fiber.Map {
	return fiber.Map{
		"success": true,
		"message": msg,
		"data":    data,
	}
}

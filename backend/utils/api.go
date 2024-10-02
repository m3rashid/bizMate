package utils

import (
	"errors"
	"strings"

	"github.com/go-playground/validator/v10"
	"github.com/gofiber/fiber/v2"
)

const (
	_required string = "required"
	_min      string = "min"
	_max      string = "max"
	_email    string = "email"
	_phone    string = "phone"
)

func formatValidatorError(valErrors validator.ValidationErrors) string {
	allErrors := []string{}
	for _, validationErr := range valErrors {
		tagName := validationErr.Tag()
		fieldName := validationErr.Field()
		validationParam := validationErr.Param()

		errorMsg := ""
		switch tagName {
		case _required:
			errorMsg = fieldName + " is required"
		case _min:
			errorMsg = fieldName + " length must be greater than " + validationParam
		case _max:
			errorMsg = fieldName + " length must be less than " + validationParam
		case _email:
			errorMsg = fieldName + " must be a valid email address"
		case _phone:
			errorMsg = fieldName + " must be a valid phone number"
		default:
			errorMsg = fieldName + " is invalid"
		}

		allErrors = append(allErrors, errorMsg)
	}

	return strings.Join(allErrors, ", ")
}

func ParseBodyAndValidate[T interface{}](ctx *fiber.Ctx, str *T) error {
	if err := ctx.BodyParser(str); err != nil {
		return errors.New("invalid data provided")
	}

	validate := validator.New()
	if err := validate.Struct(str); err != nil {
		if validationErrors, ok := err.(validator.ValidationErrors); ok {
			return errors.New(formatValidatorError(validationErrors))
		}
		return errors.New("invalid data provided")
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

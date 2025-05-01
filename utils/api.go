package utils

import (
	"bizMate/i18n"
	"errors"
	"fmt"
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

func formatValidatorError(ctx *fiber.Ctx, valErrors validator.ValidationErrors) string {
	allErrors := []string{}
	for _, validationErr := range valErrors {
		tagName := validationErr.Tag()
		fieldName := validationErr.Field()
		validationParam := validationErr.Param()

		errorMsg := ""
		switch tagName {
		case _required:
			errorMsg = fmt.Sprintf("%s %s", fieldName, i18n.ToLocalString(ctx, "is required"))
		case _min:
			errorMsg = fmt.Sprintf(
				"%s %s %s %s",
				fieldName,
				i18n.ToLocalString(ctx, "length must be greater than"),
				validationParam,
				i18n.ToLocalString(ctx, "characters"),
			)
		case _max:
			errorMsg = fmt.Sprintf(
				"%s %s %s %s",
				fieldName,
				i18n.ToLocalString(ctx, "length must be less than"),
				validationParam,
				i18n.ToLocalString(ctx, "characters"),
			)
		case _email:
			errorMsg = fmt.Sprintf("%s %s", fieldName, i18n.ToLocalString(ctx, "must be a valid email address"))
		case _phone:
			errorMsg = fmt.Sprintf("%s %s", fieldName, i18n.ToLocalString(ctx, "must be a valid phone number"))
		default:
			errorMsg = fmt.Sprintf("%s %s", fieldName, i18n.ToLocalString(ctx, "is invalid"))
		}

		allErrors = append(allErrors, errorMsg)
	}

	return strings.Join(allErrors, "\n")
}

func ParseBodyAndValidate[T interface{}](ctx *fiber.Ctx, str *T) error {
	if err := ctx.BodyParser(str); err != nil {
		return errors.New(i18n.ToLocalString(ctx, "invalid data provided"))
	}

	validate := validator.New()
	if err := validate.Struct(str); err != nil {
		if validationErrors, ok := err.(validator.ValidationErrors); ok {
			return errors.New(formatValidatorError(ctx, validationErrors))
		}
		return errors.New(i18n.ToLocalString(ctx, "invalid data provided"))
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

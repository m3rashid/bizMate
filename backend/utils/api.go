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

type PaginationResponse[T any] struct {
	Docs            []T   `json:"docs"`
	Limit           int   `json:"limit"`
	Count           int   `json:"count"`
	TotalDocs       int64 `json:"totalDocs"`
	CurrentPage     int   `json:"page"`
	HasNextPage     bool  `json:"hasNextPage"`
	HasPreviousPage bool  `json:"hasPreviousPage"`
}

var DefaultPaginationResponse = PaginationResponse[interface{}]{
	Docs:            []interface{}{},
	Limit:           0,
	Count:           0,
	TotalDocs:       0,
	CurrentPage:     1,
	HasNextPage:     false,
	HasPreviousPage: false,
}

type PaginationRequestQuery struct {
	Page  int `json:"page"`
	Limit int `json:"limit"`
}

func SendResponse(data interface{}, msg string) fiber.Map {
	return fiber.Map{
		"success": true,
		"message": msg,
		"data":    data,
	}
}

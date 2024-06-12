package controllers

import (
	"bizmate/utils"

	"github.com/gofiber/fiber/v2"
	"gorm.io/gorm"
)

type CreateOptions[CreateBodyType interface{}, Model interface{}] struct {
	GetDefaultValues func(values *CreateBodyType, ctx *fiber.Ctx) *Model
	PreCreate        func(values *CreateBodyType, db *gorm.DB, ctx *fiber.Ctx) (*Model, error)
	PostCreate       func(values *CreateBodyType, model *Model, db *gorm.DB, ctx *fiber.Ctx) (interface{}, error)
}

func Create[CreateBodyType interface{}, Model interface{}](tableName string, _options ...CreateOptions[CreateBodyType, Model]) func(*fiber.Ctx) error {
	if len(_options) > 1 {
		panic("Only one option is allowed")
	}

	options := CreateOptions[CreateBodyType, Model]{}
	if len(_options) > 0 {
		options = _options[0]
	}

	return func(ctx *fiber.Ctx) error {
		var formBody CreateBodyType
		var model *Model

		if err := utils.ParseBodyAndValidate(ctx, &formBody); err != nil {
			return ctx.Status(fiber.StatusBadRequest).JSON(err.Error())
		}

		if options.GetDefaultValues != nil {
			model = options.GetDefaultValues(&formBody, ctx)
		}

		db, err := utils.GetTenantDbFromCtx(ctx)
		if err != nil {
			return ctx.SendStatus(fiber.StatusInternalServerError)
		}

		if options.PreCreate != nil {
			model, err = options.PreCreate(&formBody, db, ctx)
			if err != nil {
				return ctx.SendStatus(fiber.StatusInternalServerError)
			}
		}

		if err := db.Table(tableName).Create(utils.Ternary[interface{}](model != nil, &model, &formBody)).Error; err != nil {
			return ctx.SendStatus(fiber.StatusInternalServerError)
		}

		var result interface{} = formBody
		if options.PostCreate != nil {
			result, err = options.PostCreate(&formBody, model, db, ctx)
			if err != nil {
				return ctx.SendStatus(fiber.StatusInternalServerError)
			}
		}

		return ctx.Status(fiber.StatusCreated).JSON(result)
	}
}

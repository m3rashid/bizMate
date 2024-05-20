package controllers

import (
	"bizmate/utils"
	"fmt"

	"github.com/gofiber/fiber/v2"
)

type UpdateOptions struct {
	ParamValue string // coming from ctx.Params(ParamKey)
	ParamKey   string // what entry in db to match paramValue with
}

func Update[Model DbModel](_options ...UpdateOptions) func(*fiber.Ctx) error {
	var _mod Model
	tableName := _mod.TableName()

	if len(_options) > 1 {
		panic("Only one option is allowed")
	}

	options := UpdateOptions{}
	if len(_options) > 0 {
		options = _options[0]
	}

	return func(ctx *fiber.Ctx) error {
		paramValue := ctx.Params(options.ParamValue)
		var updateBody Model
		err := utils.ParseBodyAndValidate(ctx, &updateBody)
		if err != nil {
			return ctx.Status(fiber.StatusBadRequest).JSON(fiber.Map{"error": "error in form validation"})
		}

		db, err := utils.GetTenantDbFromCtx(ctx)
		if err != nil {
			return ctx.SendStatus(fiber.StatusInternalServerError)
		}

		// var column Model
		if err := db.Table(tableName).Where(fmt.Sprintf("%s = ?", paramValue), options.ParamKey).Updates(updateBody).Error; err != nil {
			return ctx.SendStatus(fiber.StatusInternalServerError)
		}

		return ctx.Status(fiber.StatusOK).JSON(fiber.Map{})
	}
}

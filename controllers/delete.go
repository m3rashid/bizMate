package controllers

import (
	"bizmate/utils"
	"fmt"

	"github.com/gofiber/fiber/v2"
)

type DeleteOptions struct {
	ParamValue string
	ParamKey   string
	HardDelete bool // default false: soft-delete (set the deleted column to true)
}

func Delete[Model DbModel](_options ...DeleteOptions) func(*fiber.Ctx) error {
	// var _mod Model
	// tableName := _mod.TableName()

	if len(_options) > 1 {
		panic("Only one option is allowed")
	}

	options := DeleteOptions{}
	if len(_options) > 0 {
		options = _options[0]
	}

	return func(ctx *fiber.Ctx) error {
		paramValue := ctx.Params(options.ParamValue)

		db, err := utils.GetTenantDbFromCtx(ctx)
		if err != nil {
			return ctx.SendStatus(fiber.StatusInternalServerError)
		}

		searchCriteria := fmt.Sprintf("%s = ?", options.ParamKey)
		if options.HardDelete {
			err = db.Delete(searchCriteria, paramValue).Error
		} else {
			err = db.Where(searchCriteria, paramValue).Update("deleted", true).Error
		}
		if err != nil {
			return ctx.SendStatus(fiber.StatusInternalServerError)
		}

		return ctx.Status(fiber.StatusOK).JSON(fiber.Map{"message": "deleted successfully"})
	}
}

package controllers

import (
	"bizmate/utils"
	"fmt"

	"github.com/gofiber/fiber/v2"
)

type GetOptions struct {
	ParamValue         string // coming from ctx.Params(ParamKey)
	ParamKey           string // what entry in db to match paramValue with
	Populate           []string
	IncludeSoftDeleted bool // default false: dont include soft deleted
}

func Get[Model DbModel](_options ...GetOptions) func(*fiber.Ctx) error {
	// var _mod Model
	// tableName := _mod.TableName()

	if len(_options) > 1 {
		panic("Only one option is allowed")
	}

	options := GetOptions{}
	if len(_options) > 0 {
		options = _options[0]
	}

	return func(ctx *fiber.Ctx) error {
		paramValue := ctx.Params(options.ParamValue)

		db, err := utils.GetTenantDbFromCtx(ctx)
		if err != nil {
			return ctx.SendStatus(fiber.StatusInternalServerError)
		}

		var column Model
		if len(options.Populate) > 0 {
			for _, populate := range options.Populate {
				db = db.Preload(populate)
			}
		}

		if !options.IncludeSoftDeleted {
			db = db.Where("deleted = false")
		}

		if err := db.Where(fmt.Sprintf("%s = ?", options.ParamKey), paramValue).First(&column).Error; err != nil {
			return ctx.SendStatus(fiber.StatusInternalServerError)
		}

		return ctx.Status(fiber.StatusOK).JSON(column)
	}
}

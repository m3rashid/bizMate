package controllers

import (
	"bizmate/utils"
	"fmt"

	"github.com/gofiber/fiber/v2"
	"gorm.io/gorm"
)

type DeleteOptions[Model DbModel] struct {
	ParamValue string // coming from ctx.Params(ParamKey)
	ParamKey   string // what entry in db to match paramValue with
	HardDelete bool   // default false: soft-delete (set the deleted column to true)
	PreDelete  func(db *gorm.DB, ctx *fiber.Ctx) error
	PostDelete func(db *gorm.DB, ctx *fiber.Ctx) error
}

func Delete[Model DbModel](_options ...DeleteOptions[Model]) func(*fiber.Ctx) error {
	var _mod Model
	tableName := _mod.TableName()

	if len(_options) > 1 {
		panic("Only one option is allowed")
	}

	options := DeleteOptions[Model]{}
	if len(_options) > 0 {
		options = _options[0]
	}

	return func(ctx *fiber.Ctx) error {
		paramValue := ctx.Params(options.ParamValue)

		db, err := utils.GetTenantDbFromCtx(ctx)
		if err != nil {
			return ctx.SendStatus(fiber.StatusInternalServerError)
		}

		if options.PreDelete != nil {
			err := options.PreDelete(db, ctx)
			if err != nil {
				return ctx.SendStatus(fiber.StatusInternalServerError)
			}
		}

		db = db.Table(tableName).Where(fmt.Sprintf("%s = ?", options.ParamKey), paramValue)
		if options.HardDelete {
			err = db.Error
		} else {
			err = db.Update("deleted", true).Error
		}
		if err != nil {
			return ctx.SendStatus(fiber.StatusInternalServerError)
		}

		if options.PostDelete != nil {
			err = options.PostDelete(db, ctx)
			if err != nil {
				return ctx.SendStatus(fiber.StatusInternalServerError)
			}
		}

		return ctx.Status(fiber.StatusOK).JSON(fiber.Map{"message": "deleted successfully"})
	}
}

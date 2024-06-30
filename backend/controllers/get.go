package controllers

import (
	"bizMate/utils"
	"fmt"

	"github.com/gofiber/fiber/v2"
)

type GetOptions struct {
	ParamValue             string // coming from ctx.Params(ParamKey)
	ParamKey               string // what entry in db to match paramValue with
	Populate               []string
	IncludeSoftDeleted     bool // default false: dont include soft deleted
	GetWorkspaceID         func(*fiber.Ctx) (uint, error)
	DontIncludeWorkspaceID bool
}

func Get[Model DbModel](_options ...GetOptions) func(*fiber.Ctx) error {
	if len(_options) > 1 {
		panic("Only one option is allowed")
	}

	options := GetOptions{}
	if len(_options) > 0 {
		options = _options[0]
	}

	return func(ctx *fiber.Ctx) error {
		paramValue := ctx.Params(options.ParamValue)

		workspaceId := uint(0)
		if options.GetWorkspaceID != nil {
			wId, err := options.GetWorkspaceID(ctx)
			if err != nil {
				return ctx.SendStatus(fiber.StatusBadRequest)
			}
			workspaceId = wId
		}

		db, err := utils.GetDB()
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

		var query string
		if options.DontIncludeWorkspaceID {
			query = fmt.Sprintf("%s = ?", options.ParamKey)
		} else {
			query = fmt.Sprintf("%s = ? and \"workspaceId\" = %d", options.ParamKey, workspaceId)
		}
		if err := db.Where(query, paramValue).First(&column).Error; err != nil {
			return ctx.SendStatus(fiber.StatusInternalServerError)
		}

		return ctx.Status(fiber.StatusOK).JSON(column)
	}
}

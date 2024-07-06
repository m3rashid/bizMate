package controllers

// import (
// 	"bizMate/utils"
// 	"fmt"

// 	"github.com/gofiber/fiber/v2"
// 	"github.com/google/uuid"
// )

// type GetOptions struct {
// 	ParamValue             string // coming from ctx.Params(ParamKey)
// 	ParamKey               string // what entry in db to match paramValue with
// 	Populate               []string
// 	IncludeSoftDeleted     bool // default false: dont include soft deleted
// 	GetWorkspaceID         func(*fiber.Ctx) (uuid.UUID, error)
// 	DontIncludeWorkspaceID bool
// }

// func Get[Model DbModel](_options ...GetOptions) func(*fiber.Ctx) error {
// 	if len(_options) > 1 {
// 		panic("Only one option is allowed")
// 	}

// 	options := GetOptions{}
// 	if len(_options) > 0 {
// 		options = _options[0]
// 	}

// 	return func(ctx *fiber.Ctx) error {
// 		paramValue := ctx.Params(options.ParamValue)

// 		var workspaceId uuid.UUID
// 		if options.GetWorkspaceID != nil {
// 			wId, err := options.GetWorkspaceID(ctx)
// 			if err != nil {
// 				return ctx.SendStatus(fiber.StatusBadRequest)
// 			}
// 			workspaceId = wId
// 		} else {
// 			_, wId := utils.GetUserAndWorkspaceIdsOrZero(ctx)
// 			workspaceId = wId
// 		}

// 		db, err := utils.GetPostgresDB()
// 		if err != nil {
// 			return ctx.SendStatus(fiber.StatusInternalServerError)
// 		}

// 		var column Model
// 		if len(options.Populate) > 0 {
// 			for _, populate := range options.Populate {
// 				db = db.Preload(populate)
// 			}
// 		}

// 		if !options.IncludeSoftDeleted {
// 			db = db.Where("deleted = false")
// 		}

// 		if options.DontIncludeWorkspaceID {
// 			err = db.Where(fmt.Sprintf("%s = ?", options.ParamKey), paramValue).First(&column).Error
// 		} else {
// 			err = db.Where(fmt.Sprintf("%s = ? and \"workspaceId\" = '%s'", options.ParamKey, workspaceId), paramValue).First(&column).Error
// 		}

// 		if err != nil {
// 			return ctx.SendStatus(fiber.StatusInternalServerError)
// 		}

// 		return ctx.Status(fiber.StatusOK).JSON(column)
// 	}
// }

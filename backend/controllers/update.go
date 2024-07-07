package controllers

// import (
// 	"bizMate/utils"
// 	"fmt"

// 	"github.com/gofiber/fiber/v2"
// 	"gorm.io/gorm"
// )

// type UpdateOptions[UpdateBodyType interface{}, Model DbModel] struct {
// 	ParamValue string // coming from ctx.Params(ParamKey)
// 	ParamKey   string // what entry in db to match paramValue with
// 	PreUpdate  func(values *UpdateBodyType, model *Model, db *gorm.DB, ctx *fiber.Ctx) error
// 	PostUpdate func(values *UpdateBodyType, model *Model, db *gorm.DB, ctx *fiber.Ctx) (interface{}, error)
// }

// // TODO: make sure the workspaceId is not updatable

// func Update[UpdateBodyType interface{}, Model DbModel](_options ...UpdateOptions[UpdateBodyType, Model]) func(*fiber.Ctx) error {
// 	var _mod Model
// 	tableName := _mod.TableName()

// 	if len(_options) > 1 {
// 		panic("Only one option is allowed")
// 	}

// 	options := UpdateOptions[UpdateBodyType, Model]{}
// 	if len(_options) > 0 {
// 		options = _options[0]
// 	}

// 	return func(ctx *fiber.Ctx) error {
// 		var updateBody UpdateBodyType
// 		var model Model

// 		paramValue := ctx.Params(options.ParamValue)
// 		err := utils.ParseBodyAndValidate(ctx, &updateBody)
// 		if err != nil {
// 			return ctx.Status(fiber.StatusBadRequest).JSON(utils.TranslateToLocalLanguage(ctx, "error in form validation"))
// 		}

// 		db, err := utils.GetPostgresDB()
// 		if err != nil {
// 			return ctx.SendStatus(fiber.StatusInternalServerError)
// 		}

// 		if options.PreUpdate != nil {
// 			err = options.PreUpdate(&updateBody, &model, db, ctx)
// 			if err != nil {
// 				return ctx.SendStatus(fiber.StatusInternalServerError)
// 			}
// 		}

// 		if err := db.Table(tableName).Where(fmt.Sprintf("%s = ?", options.ParamKey), paramValue).Updates(updateBody).Error; err != nil {
// 			return ctx.SendStatus(fiber.StatusInternalServerError)
// 		}

// 		var result interface{} = updateBody
// 		if options.PostUpdate != nil {
// 			result, err = options.PostUpdate(&updateBody, &model, db, ctx)
// 			if err != nil {
// 				return ctx.SendStatus(fiber.StatusInternalServerError)
// 			}
// 		}

// 		return ctx.Status(fiber.StatusOK).JSON(result)
// 	}
// }

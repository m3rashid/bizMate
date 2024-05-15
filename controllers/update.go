package controllers

import (
	"bizmate/utils"
	"encoding/json"
	"log"

	"github.com/go-playground/validator/v10"
	"github.com/gofiber/fiber/v2"
	"gorm.io/gorm"
)

func Update[T interface{}](
	tableName string,
	options UpdateOptions[T],
) func(*fiber.Ctx) error {
	return func(ctx *fiber.Ctx) error {
		var updateBody UpdateBody
		err := ctx.BodyParser(&updateBody)
		if err != nil {
			log.Println(err)
			return ctx.Status(400).JSON(fiber.Map{
				"error": err.Error(),
			})
		}

		update := updateBody.Update
		searchCriteria := updateBody.SearchCriteria

		if searchCriteria == nil {
			return ctx.Status(400).JSON(fiber.Map{
				"error": "search criteria is required",
			})
		}

		validate := validator.New()
		err = validate.Struct(update)
		if err != nil {
			log.Println(err)
			return ctx.Status(fiber.StatusBadRequest).JSON(fiber.Map{
				"error": err.Error(),
			})
		}

		var db *gorm.DB
		if options.GetDB != nil {
			db = options.GetDB()
		} else {
			db, err = utils.GetTenantDbFromCtx(ctx)
			if err != nil {
				return ctx.Status(fiber.StatusInternalServerError).JSON(fiber.Map{
					"error": err.Error(),
				})
			}
		}

		err = db.Table(tableName).Where(searchCriteria).Updates(update).Error
		if err != nil {
			return ctx.Status(fiber.StatusInternalServerError).JSON(fiber.Map{
				"error": err.Error(),
			})
		}

		jsonByte, err := json.Marshal(update)
		if err != nil {
			return ctx.Status(fiber.StatusInternalServerError).JSON(fiber.Map{
				"error": err.Error(),
			})
		}

		var createdResponse CreatedDBResponse
		err = json.Unmarshal(jsonByte, &createdResponse)
		if err != nil {
			return ctx.Status(fiber.StatusInternalServerError).JSON(fiber.Map{
				"error": err.Error(),
			})
		}

		// models.Flows <- models.WorkflowAction{
		// 	TriggerModel:  tableName,
		// 	TriggerAction: models.UpdateAction,
		// 	TenantUrl:     ctx.GetReqHeaders()["Origin"][0],
		// 	ObjectID:      createdResponse.ID, // handle this
		// 	RetryIndex:    0,
		// }

		// if updateBody.ResourceIndex.Name != "" && updateBody.ResourceIndex.ResourceType != "" {
		// 	newResource := models.Resource{
		// 		Name:         updateBody.ResourceIndex.Name,
		// 		Description:  updateBody.ResourceIndex.Description,
		// 		ResourceID:   createdResponse.ID,
		// 		ResourceType: updateBody.ResourceIndex.ResourceType,
		// 	}

		// 	err = db.Table(models.RESOURCE_MODEL_NAME).Where("resourceId = ?", createdResponse.ID).Updates(&newResource).Error
		// 	if err != nil {
		// 		return ctx.Status(fiber.StatusInternalServerError).JSON(fiber.Map{
		// 			"error": err.Error(),
		// 		})
		// 	}
		// }

		return ctx.Status(fiber.StatusOK).JSON(fiber.Map{
			"message": "Document updated successfully",
		})
	}
}

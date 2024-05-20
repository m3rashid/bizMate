package controllers

// func Create[T interface{}](
// 	tableName string,
// 	options CreateOptions[T],
// ) func(*fiber.Ctx) error {
// 	return func(ctx *fiber.Ctx) error {
// 		var data CreateRequestBody[T]
// 		err := ctx.BodyParser(&data)
// 		if err != nil {
// 			return ctx.Status(fiber.StatusBadRequest).JSON(fiber.Map{"error": err.Error()})
// 		}

// 		var db *gorm.DB
// 		if options.GetDB != nil {
// 			db = options.GetDB()
// 		} else {
// 			db, err = utils.GetTenantDbFromCtx(ctx)
// 			if err != nil {
// 				return ctx.Status(fiber.StatusInternalServerError).JSON(fiber.Map{
// 					"error": err.Error(),
// 				})
// 			}
// 		}

// 		if options.PreCreate != nil {
// 			err = options.PreCreate(ctx, db, &data.Body)
// 			if err != nil {
// 				log.Println("Pre Create Error: ", err.Error())
// 				return ctx.Status(fiber.StatusInternalServerError).JSON(fiber.Map{
// 					"error": err.Error(),
// 				})
// 			}
// 		}

// 		validate := validator.New()
// 		err = validate.Struct(data)
// 		if err != nil {
// 			return ctx.Status(fiber.StatusBadRequest).JSON(fiber.Map{
// 				"error": err.Error(),
// 			})
// 		}

// 		err = db.Create(&data.Body).Error
// 		if err != nil {
// 			return ctx.Status(fiber.StatusInternalServerError).JSON(fiber.Map{
// 				"error": err.Error(),
// 			})
// 		}

// 		if options.PostCreate != nil {
// 			err = options.PostCreate(ctx, db, &data.Body)
// 			if err != nil {
// 				log.Println("Post Create Error: ", err.Error())
// 				return ctx.Status(fiber.StatusInternalServerError).JSON(fiber.Map{
// 					"error": err.Error(),
// 				})
// 			}
// 		}

// 		jsonByte, err := json.Marshal(data.Body)
// 		if err != nil {
// 			return ctx.Status(fiber.StatusInternalServerError).JSON(fiber.Map{
// 				"error": err.Error(),
// 			})
// 		}

// 		var createdResponse CreatedDBResponse
// 		err = json.Unmarshal(jsonByte, &createdResponse)
// 		if err != nil {
// 			return ctx.Status(fiber.StatusInternalServerError).JSON(fiber.Map{
// 				"error": err.Error(),
// 			})
// 		}

// 		// models.Flows <- models.WorkflowAction{
// 		// 	TriggerModel:  tableName,
// 		// 	TriggerAction: models.CreateAction,
// 		// 	TenantUrl:     ctx.GetReqHeaders()["Origin"][0],
// 		// 	ObjectID:      createdResponse.ID,
// 		// 	RetryIndex:    0,
// 		// }

// 		// if data.ResourceIndex.Name != "" && data.ResourceIndex.ResourceType != "" {
// 		// 	newResource := models.Resource{
// 		// 		ResourceID:   createdResponse.ID,
// 		// 		Name:         data.ResourceIndex.Name,
// 		// 		Description:  data.ResourceIndex.Description,
// 		// 		ResourceType: data.ResourceIndex.ResourceType,
// 		// 	}

// 		// 	err = db.Create(&newResource).Error
// 		// 	if err != nil {
// 		// 		return ctx.Status(fiber.StatusInternalServerError).JSON(fiber.Map{
// 		// 			"error": err.Error(),
// 		// 		})
// 		// 	}
// 		// }

// 		return ctx.Status(fiber.StatusCreated).JSON(fiber.Map{
// 			"message": "Created Successfully",
// 		})
// 	}
// }

package scripts

import (
	"bizmate/auth"
	"bizmate/models"
	"bizmate/utils"

	"github.com/go-playground/validator/v10"
	"github.com/gofiber/fiber/v2"
)

type createTenantStruct struct {
	OwnerName     string `json:"ownerName" validate:"required"`
	OwnerEmail    string `json:"ownerEmail" validate:"required"`
	OwnerPassword string `json:"ownerPassword" validate:"required"`
	DbName        string `json:"dbName" validate:"required"`
	TenantName    string `json:"tenantName" validate:"required"`
	TenantUrl     string `json:"tenantUrl" validate:"required"`
}

// var _sampleCreateTenant = createTenantStruct{
// 	OwnerName:     "Owner Localhost 5173",
// 	OwnerEmail:    "owner@localhost5173.com",
// 	OwnerPassword: "localhost:5173",
// 	DbName:        "localhost5173",
// 	TenantName:    "localhost_5173",
// 	TenantUrl:     "localhost:5173",
// }

func createTenant(props createTenantStruct) error {
	db := utils.GetHostDB()
	hashedPassword, err := auth.HashPassword(props.OwnerPassword)
	if err != nil {
		return err
	}

	db.Begin()
	defer db.Rollback()

	tenantOwner := models.TenantOwner{
		Name:     props.OwnerName,
		Email:    props.OwnerEmail,
		Password: hashedPassword,
	}
	err = db.Create(&tenantOwner).Error
	if err != nil {
		return err
	}

	dbUrl, err := utils.CreateDatabase(props.DbName, db)
	if err != nil {
		return err
	}

	tenant := models.Tenant{
		Name:                     props.TenantName,
		TenantUrl:                props.TenantUrl,
		TenantDBConnectionString: dbUrl,
		TenantOwnerID:            tenantOwner.ID,
	}
	err = db.Create(&tenant).Error
	if err != nil {
		return err
	}

	db.Commit()
	return nil
}

func createTenantHandler(c *fiber.Ctx) error {
	var props createTenantStruct
	if err := c.BodyParser(&props); err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{"error": err.Error()})
	}

	validate := validator.New()
	err := validate.Struct(props)
	if err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{"error": err.Error()})
	}

	err = createTenant(props)
	if err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{"error": err.Error()})
	}

	return c.Status(fiber.StatusOK).JSON(fiber.Map{"success": true, "message": "Tenant Created"})
}

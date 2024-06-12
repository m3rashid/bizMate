package scripts

import (
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

func createTenant(props createTenantStruct) error {
	db := utils.GetHostDB()
	hashedPassword, err := utils.HashPassword(props.OwnerPassword)
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

	dbUrl, err := utils.CreateTenantDatabase(props.DbName, db)
	if err != nil {
		return err
	}

	tenant := models.Tenant{
		Name:          props.TenantName,
		TenantUrl:     props.TenantUrl,
		DbUri:         dbUrl,
		TenantOwnerID: tenantOwner.ID,
	}
	err = db.Create(&tenant).Error
	if err != nil {
		return err
	}

	db.Commit()
	return nil
}

func createTenantHandler(ctx *fiber.Ctx) error {
	var props createTenantStruct
	if err := ctx.BodyParser(&props); err != nil {
		return ctx.Status(fiber.StatusBadRequest).JSON(err.Error())
	}

	validate := validator.New()
	err := validate.Struct(props)
	if err != nil {
		return ctx.Status(fiber.StatusBadRequest).JSON(err.Error())
	}

	err = createTenant(props)
	if err != nil {
		return ctx.SendStatus(fiber.StatusInternalServerError)
	}

	return ctx.Status(fiber.StatusOK).JSON("Tenant Created")
}

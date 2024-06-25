package contacts

import (
	"time"

	"github.com/gofiber/fiber/v2"
)

type CreateContactReqBody struct {
	Name         string                 `json:"name" validate:"required"`
	Email        string                 `json:"email" validate:"required,email"`
	Phone        string                 `json:"phone"`
	Birthday     time.Time              `json:"birthday"`
	OtherPhones  []string               `json:"otherPhones"`
	OtherEmails  []string               `json:"otherEmails"`
	OtherDetails map[string]interface{} `json:"otherDetails"`
}

func bulkContactsUpload(ctx *fiber.Ctx) error {
	// TODO: Implement bulkContactsUpload

	/*
		1. Get the uploaded file
		2. Get the data mappings from the request body
		3. Parse the file and create contacts with mappings from the request body
		4. insert the contacts into the database
	*/
	return nil
}

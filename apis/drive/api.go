package drive

import (
	"bizmate/utils"
	"fmt"

	"github.com/gofiber/fiber/v2"
)

type uploadFileReqBody = struct {
	Name string `json:"name" validate:"required"`
	Type string `json:"type" validate:"required"`
}

func uploadFile(ctx *fiber.Ctx) error {
	// userId := ctx.Locals("userId").(uint)
	// if userId == 0 {
	// 	return ctx.Status(fiber.StatusUnauthorized).JSON("Unauthorized")
	// }
	tenantOrigin, err := utils.GetTenantOriginFromCtx(ctx)
	if err != nil {
		return ctx.Status(fiber.StatusBadRequest).JSON(err.Error())
	}

	reqBody := uploadFileReqBody{}
	if err := utils.ParseBodyAndValidate(ctx, &reqBody); err != nil {
		return ctx.Status(fiber.StatusBadRequest).JSON(err.Error())
	}

	key := fmt.Sprintf("%s/%s-%s", tenantOrigin, utils.RandomString32(), reqBody.Name)
	presignedUrl, err := utils.PutPresignURL(key)
	if err != nil {
		return ctx.Status(fiber.StatusBadRequest).JSON(err.Error())
	}

	return ctx.Status(fiber.StatusOK).JSON(fiber.Map{"url": presignedUrl, "key": key})
}

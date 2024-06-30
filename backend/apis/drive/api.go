package drive

import (
	"bizMate/utils"
	"fmt"

	"github.com/gofiber/fiber/v2"
)

type uploadFileReqBody = struct {
	Name string `json:"name" validate:"required"`
	Type string `json:"type" validate:"required"`
}

func uploadFile(ctx *fiber.Ctx) error {
	userId, workspaceId := utils.GetUserAndWorkspaceIdsOrZero(ctx)
	reqBody := uploadFileReqBody{}
	if err := utils.ParseBodyAndValidate(ctx, &reqBody); err != nil {
		return ctx.Status(fiber.StatusBadRequest).JSON(err.Error())
	}

	key := fmt.Sprintf("%d/%d/%s-%s", workspaceId, userId, utils.RandomString32(), reqBody.Name)
	presignedUrl, err := utils.PutPresignURL(key)
	if err != nil {
		return ctx.Status(fiber.StatusBadRequest).JSON(err.Error())
	}

	return ctx.Status(fiber.StatusOK).JSON(fiber.Map{"url": presignedUrl, "key": key})
}

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
		return fiber.NewError(fiber.StatusBadRequest, err.Error())
	}

	key := fmt.Sprintf("%d/%d/%s-%s", workspaceId, userId, utils.RandomString32(), reqBody.Name)
	presignedUrl, err := utils.PutPresignURL(key)
	if err != nil {
		return fiber.NewError(fiber.StatusBadRequest, err.Error())
	}

	return ctx.Status(fiber.StatusOK).JSON(utils.SendResponse(fiber.Map{"url": presignedUrl, "key": key}, "Presigned URL generated successfully"))
}

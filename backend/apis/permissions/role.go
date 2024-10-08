package permissions

import (
	"bizMate/repository"
	"bizMate/utils"

	"github.com/gofiber/fiber/v2"
	"github.com/google/uuid"
)

func createRole(ctx *fiber.Ctx) error {
	userId, workspaceId := utils.GetUserAndWorkspaceIdsOrZero(ctx)
	userEmail := utils.GetUserEmailFromCtx(ctx)

	reqBody := createRoleReqBody{}
	if err := utils.ParseBodyAndValidate(ctx, &reqBody); err != nil {
		go utils.LogError(
			create_role,
			userEmail,
			workspaceId,
			repository.RoleObjectType,
			repository.LogData{
				"error": err.Error(),
			},
		)
		return fiber.NewError(fiber.StatusBadRequest, err.Error())
	}

	uuidv7, err := utils.GenerateUuidV7()
	if err != nil {
		go utils.LogError(
			create_role,
			userEmail,
			workspaceId,
			repository.RoleObjectType,
			repository.LogData{
				"error": err.Error(),
			},
		)
		return fiber.NewError(fiber.StatusInternalServerError)
	}

	pgConn, err := utils.GetPostgresDB()
	if err != nil {
		return fiber.NewError(fiber.StatusInternalServerError)
	}

	queries := repository.New(pgConn)
	if err := queries.CreateRole(ctx.Context(), repository.CreateRoleParams{
		ID:          uuidv7,
		Name:        reqBody.Name,
		Description: &reqBody.Description,
		WorkspaceID: workspaceId,
		Permissions: reqBody.Permissions,
		CreatedByID: userId,
	}); err != nil {
		go utils.LogError(
			create_role,
			userEmail,
			workspaceId,
			repository.RoleObjectType,
			repository.LogData{
				"error": err.Error(),
			},
		)
		return fiber.NewError(fiber.StatusInternalServerError)
	}

	go utils.LogInfo(
		create_role,
		userEmail,
		workspaceId,
		repository.RoleObjectType,
		repository.LogData{
			"role_name": reqBody.Name,
		},
	)
	return ctx.Status(fiber.StatusOK).JSON(utils.SendResponse(nil, "Role created successfully"))
}

func getRoleById(ctx *fiber.Ctx) error {
	roleId := ctx.Params("roleId")
	if roleId == "" {
		return fiber.NewError(fiber.StatusBadRequest, "Role ID is required")
	}

	roleIdUuidV7, err := utils.StringToUuid(roleId)
	if err != nil {
		return fiber.NewError(fiber.StatusBadRequest, "Invalid Role ID")
	}

	_, workspaceId := utils.GetUserAndWorkspaceIdsOrZero(ctx)
	pgConn, err := utils.GetPostgresDB()
	if err != nil {
		return fiber.NewError(fiber.StatusInternalServerError)
	}

	queries := repository.New(pgConn)
	role, err := queries.GetRoleById(ctx.Context(), repository.GetRoleByIdParams{
		WorkspaceID: workspaceId,
		ID:          roleIdUuidV7,
	})
	if err != nil {
		return fiber.NewError(fiber.StatusInternalServerError)
	}

	return ctx.Status(fiber.StatusOK).JSON(utils.SendResponse(role, "Got role successfully"))
}

func getAllRolesByWorkspaceId(ctx *fiber.Ctx) error {
	_, workspaceId := utils.GetUserAndWorkspaceIdsOrZero(ctx)

	paginationRes := utils.PaginationResponse[repository.Role]{}
	if err := paginationRes.ParseQuery(ctx, 50); err != nil {
		return fiber.NewError(fiber.StatusBadRequest, "Incorrect Parameters")
	}

	pgConn, err := utils.GetPostgresDB()
	if err != nil {
		return fiber.NewError(fiber.StatusInternalServerError)
	}

	queries := repository.New(pgConn)
	roles, err := queries.GetAllRolesByWorkspaceId(ctx.Context(), workspaceId)
	if err != nil {
		return fiber.NewError(fiber.StatusInternalServerError)
	}

	paginationRes.Docs = roles
	rolesCount, err := queries.GetRolesByWorkspaceIdCount(ctx.Context(), workspaceId)
	if err != nil {
		return fiber.NewError(fiber.StatusInternalServerError)
	}

	paginationRes.TotalDocs = rolesCount
	paginationRes.BuildPaginationResponse()

	return ctx.Status(fiber.StatusOK).JSON(
		utils.SendResponse(paginationRes, "Got roles successfully"),
	)
}

func updateRole(ctx *fiber.Ctx) error {
	_, workspaceId := utils.GetUserAndWorkspaceIdsOrZero(ctx)
	userEmail := utils.GetUserEmailFromCtx(ctx)

	reqBody := updateRoleReqBody{}
	if err := utils.ParseBodyAndValidate(ctx, &reqBody); err != nil {
		go utils.LogError(
			update_role,
			userEmail,
			workspaceId,
			repository.RoleObjectType,
			repository.LogData{
				"error": err.Error(),
			},
		)
		return fiber.NewError(fiber.StatusBadRequest, err.Error())
	}

	if reqBody.RoleId == uuid.Nil {
		go utils.LogError(
			update_role,
			userEmail,
			workspaceId,
			repository.RoleObjectType,
			repository.LogData{
				"error": "Invalid Role ID",
			},
		)
		return fiber.NewError(fiber.StatusBadRequest, "Invalid Role ID")
	}

	pgConn, err := utils.GetPostgresDB()
	if err != nil {
		return fiber.NewError(fiber.StatusInternalServerError)
	}

	queries := repository.New(pgConn)
	if err := queries.UpdateRole(ctx.Context(), repository.UpdateRoleParams{
		ID:          reqBody.RoleId,
		Name:        reqBody.Name,
		Description: &reqBody.Description,
		Permissions: reqBody.Permissions,
		WorkspaceID: workspaceId,
	}); err != nil {
		go utils.LogError(
			update_role,
			userEmail,
			workspaceId,
			repository.RoleObjectType,
			repository.LogData{
				"error": err.Error(),
			},
		)
		return fiber.NewError(fiber.StatusInternalServerError)
	}

	go utils.LogInfo(
		update_role,
		userEmail,
		workspaceId,
		repository.RoleObjectType,
		repository.LogData{
			"role_id": reqBody.RoleId.String(),
		},
	)
	return ctx.Status(fiber.StatusOK).JSON(utils.SendResponse(nil, "Role updated successfully"))
}

func deleteRole(ctx *fiber.Ctx) error {
	_, workspaceId := utils.GetUserAndWorkspaceIdsOrZero(ctx)
	userEmail := utils.GetUserEmailFromCtx(ctx)

	reqBody := deleteRoleReqBody{}
	if err := utils.ParseBodyAndValidate(ctx, &reqBody); err != nil {
		go utils.LogError(
			delete_role,
			userEmail,
			workspaceId,
			repository.RoleObjectType,
			repository.LogData{
				"error": err.Error(),
			},
		)
		return fiber.NewError(fiber.StatusBadRequest, err.Error())
	}

	if reqBody.RoleId == uuid.Nil {
		go utils.LogError(
			delete_role,
			userEmail,
			workspaceId,
			repository.RoleObjectType,
			repository.LogData{
				"error": "Invalid Role ID",
			},
		)
		return fiber.NewError(fiber.StatusBadRequest, "Invalid Role ID")
	}

	pgConn, err := utils.GetPostgresDB()
	if err != nil {
		return fiber.NewError(fiber.StatusInternalServerError)
	}

	queries := repository.New(pgConn)
	if err := queries.DeleteRole(ctx.Context(), repository.DeleteRoleParams{
		WorkspaceID: workspaceId,
		ID:          reqBody.RoleId,
	}); err != nil {
		go utils.LogError(
			delete_role,
			userEmail,
			workspaceId,
			repository.RoleObjectType,
			repository.LogData{
				"error": err.Error(),
			},
		)
		return fiber.NewError(fiber.StatusInternalServerError)
	}

	go utils.LogInfo(
		delete_role,
		userEmail,
		workspaceId,
		repository.RoleObjectType,
		repository.LogData{
			"role_id": reqBody.RoleId.String(),
		},
	)
	return ctx.Status(fiber.StatusOK).JSON(utils.SendResponse(nil, "Role deleted successfully"))
}

func addUserToRole(ctx *fiber.Ctx) error {
	_, workspaceId := utils.GetUserAndWorkspaceIdsOrZero(ctx)
	userEmail := utils.GetUserEmailFromCtx(ctx)

	reqBody := addRemoveUserToRoleReqBody{}
	if err := utils.ParseBodyAndValidate(ctx, &reqBody); err != nil {
		go utils.LogError(
			add_user_to_role,
			userEmail,
			workspaceId,
			repository.RoleObjectType,
			repository.LogData{
				"error": err.Error(),
			},
		)
		return fiber.NewError(fiber.StatusBadRequest, err.Error())
	}

	if reqBody.RoleId == uuid.Nil || reqBody.UserId == uuid.Nil {
		go utils.LogError(
			add_user_to_role,
			userEmail,
			workspaceId,
			repository.RoleObjectType,
			repository.LogData{
				"error": "Invalid Role ID or User ID",
			},
		)
		return fiber.NewError(fiber.StatusBadRequest, "Invalid Role ID or User ID")
	}

	pgConn, err := utils.GetPostgresDB()
	if err != nil {
		return fiber.NewError(fiber.StatusInternalServerError)
	}

	queries := repository.New(pgConn)
	if err := queries.AddUserToRole(ctx.Context(), repository.AddUserToRoleParams{
		UserID:      reqBody.UserId,
		RoleID:      reqBody.RoleId,
		WorkspaceID: workspaceId,
	}); err != nil {
		go utils.LogError(
			add_user_to_role,
			userEmail,
			workspaceId,
			repository.RoleObjectType,
			repository.LogData{
				"error": err.Error(),
			},
		)
		return fiber.NewError(fiber.StatusInternalServerError)
	}

	go utils.LogInfo(
		add_user_to_role,
		userEmail,
		workspaceId,
		repository.RoleObjectType,
		repository.LogData{
			"role_id": reqBody.RoleId.String(),
			"user_id": reqBody.UserId.String(),
		},
	)
	return ctx.Status(fiber.StatusOK).JSON(utils.SendResponse(nil, "User added to role successfully"))
}

func removeUserFromRole(ctx *fiber.Ctx) error {
	_, workspaceId := utils.GetUserAndWorkspaceIdsOrZero(ctx)
	userEmail := utils.GetUserEmailFromCtx(ctx)

	reqBody := addRemoveUserToRoleReqBody{}
	if err := utils.ParseBodyAndValidate(ctx, &reqBody); err != nil {
		go utils.LogError(
			remove_user_from_role,
			userEmail,
			workspaceId,
			repository.RoleObjectType,
			repository.LogData{
				"error": err.Error(),
			},
		)
		return fiber.NewError(fiber.StatusBadRequest, err.Error())
	}

	if reqBody.RoleId == uuid.Nil || reqBody.UserId == uuid.Nil {
		go utils.LogError(
			remove_user_from_role,
			userEmail,
			workspaceId,
			repository.RoleObjectType,
			repository.LogData{
				"error": "Invalid Role ID or User ID",
			},
		)
		return fiber.NewError(fiber.StatusBadRequest, "Invalid Role ID or User ID")
	}

	pgConn, err := utils.GetPostgresDB()
	if err != nil {
		return fiber.NewError(fiber.StatusInternalServerError)
	}

	queries := repository.New(pgConn)
	if err := queries.RemoveUserFromRole(ctx.Context(), repository.RemoveUserFromRoleParams{
		UserID:      reqBody.UserId,
		RoleID:      reqBody.RoleId,
		WorkspaceID: workspaceId,
	}); err != nil {
		go utils.LogError(
			remove_user_from_role,
			userEmail,
			workspaceId,
			repository.RoleObjectType,
			repository.LogData{
				"error": err.Error(),
			},
		)
		return fiber.NewError(fiber.StatusInternalServerError)
	}

	go utils.LogInfo(
		remove_user_from_role,
		userEmail,
		workspaceId,
		repository.RoleObjectType,
		repository.LogData{
			"role_id": reqBody.RoleId.String(),
			"user_id": reqBody.UserId.String(),
		},
	)
	return ctx.Status(fiber.StatusOK).JSON(utils.SendResponse(nil, "User removed from role successfully"))
}

func addBarePermissionToUser(ctx *fiber.Ctx) error {
	_, workspaceId := utils.GetUserAndWorkspaceIdsOrZero(ctx)
	userEmail := utils.GetUserEmailFromCtx(ctx)

	reqBody := addBarePermissionReqBody{}
	if err := utils.ParseBodyAndValidate(ctx, &reqBody); err != nil {
		go utils.LogError(
			add_bare_permission_to_user,
			userEmail,
			workspaceId,
			repository.RoleObjectType,
			repository.LogData{
				"error": err.Error(),
			},
		)
		return fiber.NewError(fiber.StatusBadRequest, err.Error())
	}

	if reqBody.UserId == uuid.Nil {
		go utils.LogError(
			add_bare_permission_to_user,
			userEmail,
			workspaceId,
			repository.RoleObjectType,
			repository.LogData{
				"error": "Invalid User ID",
			},
		)
		return fiber.NewError(fiber.StatusBadRequest, "Invalid User ID")
	}

	pgConn, err := utils.GetPostgresDB()
	if err != nil {
		return fiber.NewError(fiber.StatusInternalServerError)
	}

	queries := repository.New(pgConn)
	if err := queries.AddBarePermissionToUser(ctx.Context(), repository.AddBarePermissionToUserParams{
		UserID:      reqBody.UserId,
		WorkspaceID: workspaceId,
		ObjectType:  reqBody.ObjectType,
		ObjectID:    reqBody.ObjectId,
		Level:       reqBody.Level,
	}); err != nil {
		go utils.LogError(
			add_bare_permission_to_user,
			userEmail,
			workspaceId,
			repository.RoleObjectType,
			repository.LogData{
				"error": err.Error(),
			},
		)
		return fiber.NewError(fiber.StatusInternalServerError)
	}

	go utils.LogInfo(
		add_bare_permission_to_user,
		userEmail,
		workspaceId,
		repository.RoleObjectType,
		repository.LogData{
			"user_id":     reqBody.UserId.String(),
			"object_id":   reqBody.ObjectId.String(),
			"object_type": reqBody.ObjectType,
			"level":       reqBody.Level,
		},
	)
	return ctx.Status(fiber.StatusOK).JSON(utils.SendResponse(nil, "Permission added successfully"))
}

func removeBarePermissionFromUser(ctx *fiber.Ctx) error {
	_, workspaceId := utils.GetUserAndWorkspaceIdsOrZero(ctx)
	userEmail := utils.GetUserEmailFromCtx(ctx)

	reqBody := addBarePermissionReqBody{}
	if err := utils.ParseBodyAndValidate(ctx, &reqBody); err != nil {
		go utils.LogError(
			remove_bare_permission_from_user,
			userEmail,
			workspaceId,
			repository.RoleObjectType,
			repository.LogData{
				"error": err.Error(),
			},
		)
		return fiber.NewError(fiber.StatusBadRequest, err.Error())
	}

	if reqBody.UserId == uuid.Nil {
		go utils.LogError(
			add_bare_permission_to_user,
			userEmail,
			workspaceId,
			repository.RoleObjectType,
			repository.LogData{
				"error": "Invalid User ID",
			},
		)
		return fiber.NewError(fiber.StatusBadRequest, "Invalid User ID")
	}

	pgConn, err := utils.GetPostgresDB()
	if err != nil {
		return fiber.NewError(fiber.StatusInternalServerError)
	}

	queries := repository.New(pgConn)
	if err := queries.RemoveBarePermissionFromUser(ctx.Context(), repository.RemoveBarePermissionFromUserParams{
		UserID:      reqBody.UserId,
		WorkspaceID: workspaceId,
		Level:       reqBody.Level,
		ObjectType:  reqBody.ObjectType,
		ObjectID:    reqBody.ObjectId,
	}); err != nil {
		go utils.LogError(
			remove_bare_permission_from_user,
			userEmail,
			workspaceId,
			repository.RoleObjectType,
			repository.LogData{
				"error": err.Error(),
			},
		)
		return fiber.NewError(fiber.StatusInternalServerError)
	}

	go utils.LogInfo(
		remove_bare_permission_from_user,
		userEmail,
		workspaceId,
		repository.RoleObjectType,
		repository.LogData{
			"user_id":     reqBody.UserId.String(),
			"object_id":   reqBody.ObjectId.String(),
			"object_type": reqBody.ObjectType,
			"level":       reqBody.Level,
		},
	)
	return ctx.Status(fiber.StatusOK).JSON(utils.SendResponse(nil, "Permission removed successfully"))
}

func getUserRoles(ctx *fiber.Ctx) error {
	_, workspaceId := utils.GetUserAndWorkspaceIdsOrZero(ctx)
	if workspaceId == uuid.Nil {
		return fiber.NewError(fiber.StatusUnauthorized)
	}

	userId := ctx.Params("userId")
	if userId == "" {
		return fiber.NewError(fiber.StatusBadRequest, "User ID is required")
	}

	userIdUuidV7, err := utils.StringToUuid(userId)
	if err != nil {
		return fiber.NewError(fiber.StatusBadRequest, "Invalid User ID")
	}

	pgConn, err := utils.GetPostgresDB()
	if err != nil {
		return fiber.NewError(fiber.StatusInternalServerError)
	}

	queries := repository.New(pgConn)
	roles, err := queries.GetRolesByUserId(
		ctx.Context(),
		repository.GetRolesByUserIdParams{
			UserID:      userIdUuidV7,
			WorkspaceID: workspaceId,
		},
	)
	if err != nil {
		return fiber.NewError(fiber.StatusInternalServerError)
	}

	return ctx.Status(fiber.StatusOK).JSON(
		utils.SendResponse(roles, "Roles found successfully"),
	)
}

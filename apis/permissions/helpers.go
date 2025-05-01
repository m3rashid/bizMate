package permissions

import (
	"bizMate/repository"

	"github.com/google/uuid"
)

const delete_role = "delete_role"
const create_role = "create_role"
const update_role = "update_role"
const add_user_to_role = "add_user_to_role"
const remove_user_from_role = "remove_user_from_role"
const add_bare_permission_to_user = "add_bare_permission_to_user"
const remove_bare_permission_from_user = "remove_bare_permission_from_user"

type createRoleReqBody struct {
	Name        string                     `json:"name" validate:"required"`
	Description string                     `json:"description"`
	WorkspaceId uuid.UUID                  `json:"workspaceId" validate:"required"`
	Permissions repository.RolePermissions `json:"permissions" validate:"required"`
}

type updateRoleReqBody struct {
	RoleId      uuid.UUID                  `json:"roleId" validate:"required"`
	Name        string                     `json:"name" validate:"required"`
	Description string                     `json:"description"`
	WorkspaceId uuid.UUID                  `json:"workspaceId" validate:"required"`
	Permissions repository.RolePermissions `json:"permissions" validate:"required"`
}

type addRemoveUserToRoleReqBody struct {
	UserId uuid.UUID `json:"userId" validate:"required"`
	RoleId uuid.UUID `json:"roleId" validate:"required"`
}

type deleteRoleReqBody struct {
	RoleId uuid.UUID `json:"roleId" validate:"required"`
}

type addBarePermissionReqBody struct {
	ObjectType repository.ObjectType      `json:"object_type" validate:"required"`
	ObjectId   uuid.UUID                  `json:"object_id"`
	UserId     uuid.UUID                  `json:"user_id" validate:"required"`
	Level      repository.PermissionLevel `json:"level" validate:"required"`
}

/* type SingleRolePermission struct {
	ObjectType ObjectType      `json:"object_type" validate:"required"`
	ObjectID   uuid.UUID       `json:"object_id"`
	UserID     uuid.UUID       `json:"user_id"`
	Level      PermissionLevel `json:"level" validate:"required"`
} */

package permissions

import (
	"bizMate/repository"

	"github.com/google/uuid"
)

const delete_role_fail = "delete_role_fail"
const delete_role_success = "delete_role_success"

const create_role_fail = "create_role_fail"
const create_role_success = "create_role_success"

const update_role_fail = "update_role_fail"
const update_role_success = "update_role_success"

const add_user_to_role_fail = "add_user_to_role_fail"
const add_user_to_role_success = "add_user_to_role_success"

const remove_user_from_role_fail = "remove_user_from_role_fail"
const remove_user_from_role_success = "remove_user_from_role_success"

const add_bare_permission_to_user_fail = "add_bare_permission_to_user_fail"
const add_bare_permission_to_user_success = "add_bare_permission_to_user_success"

const remove_bare_permission_from_user_fail = "remove_bare_permission_from_user_fail"
const remove_bare_permission_from_user_success = "remove_bare_permission_from_user_success"

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
	ObjectId   uuid.UUID                  `json:"object_id" validate:"required"`
	UserId     uuid.UUID                  `json:"user_id" validate:"required"`
	Level      repository.PermissionLevel `json:"level" validate:"required"`
}

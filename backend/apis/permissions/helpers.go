package permissions

import (
	"bizMate/repository"

	"github.com/google/uuid"
)

const get_role_by_user_id_fail = "get_role_by_user_id_fail"
const user_not_found_by_id = "user_not_found_by_id"

type createUpdateRoleReqBody struct {
	Name        string                     `json:"name" validate:"required"`
	Description string                     `json:"description"`
	WorkspaceId uuid.UUID                  `json:"workspaceId" validate:"required"`
	Permissions repository.RolePermissions `json:"permissions" validate:"required"`
}

type addRemoveUserToRoleReqBody struct {
	UserId uuid.UUID `json:"userId" validate:"required"`
	RoleId uuid.UUID `json:"roleId" validate:"required"`
}

package repository

import "github.com/google/uuid"

type PermissionLevel int32

const (
	PermissionLevelNone   PermissionLevel = 1
	PermissionLevelRead   PermissionLevel = 2
	PermissionLevelCreate PermissionLevel = 4
	PermissionLevelUpdate PermissionLevel = 8
	PermissionLevelDelete PermissionLevel = 16
	PermissionLevelExport PermissionLevel = 32
	PermissionLevelAdmin  PermissionLevel = 64
)

type ObjectType string

const (
	UserObjectType            ObjectType = "user"
	WorkspaceObjectType       ObjectType = "workspace"
	WorkspaceInviteObjectType ObjectType = "workspace_invite"
	FormObjectType            ObjectType = "form"
	FormResponsesObjectType   ObjectType = "form_responses"
	FormAnalysisObjectType    ObjectType = "form_analysis" // table not made yet
	PermissionObjectType      ObjectType = "permission"
	RoleObjectType            ObjectType = "role"
	ActivityObjectType        ObjectType = "activity"
)

type SingleRolePermission struct {
	ObjectType ObjectType      `json:"object_type" validate:"required"`
	ObjectID   uuid.UUID       `json:"object_id"`
	UserID     uuid.UUID       `json:"user_id"`
	Level      PermissionLevel `json:"level" validate:"required"`
}

type RolePermissions []SingleRolePermission

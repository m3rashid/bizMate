package repository

type SingleRolePermission struct {
	ObjectType string `json:"object_type" validate:"required"`
	ObjectID   string `json:"object_id" validate:"required"`
	UserID     string `json:"user_id" validate:"required"`
	Permission int32  `json:"permission" validate:"required"`
}

type RolePermissions []SingleRolePermission

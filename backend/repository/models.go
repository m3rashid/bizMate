// Code generated by sqlc. DO NOT EDIT.
// versions:
//   sqlc v1.26.0

package repository

import (
	"github.com/google/uuid"
	"github.com/jackc/pgx/v5/pgtype"
)

type BarePermission struct {
	ID          int32     `json:"id"`
	ObjectType  string    `json:"object_type"`
	ObjectID    uuid.UUID `json:"object_id"`
	UserID      uuid.UUID `json:"user_id"`
	WorkspaceID uuid.UUID `json:"workspace_id"`
	Permission  int32     `json:"permission"`
}

type Form struct {
	ID                      uuid.UUID          `json:"id"`
	Deleted                 *bool              `json:"deleted"`
	CreatedAt               pgtype.Timestamptz `json:"created_at"`
	WorkspaceID             uuid.UUID          `json:"workspace_id"`
	CreatedByID             uuid.UUID          `json:"created_by_id"`
	Title                   string             `json:"title"`
	Description             string             `json:"description"`
	FormBody                FormBody           `json:"form_body"`
	Active                  *bool              `json:"active"`
	SubmitText              *string            `json:"submit_text"`
	CancelText              *string            `json:"cancel_text"`
	SendResponseEmail       *bool              `json:"send_response_email"`
	AllowAnonymousResponses *bool              `json:"allow_anonymous_responses"`
	AllowMultipleResponses  *bool              `json:"allow_multiple_responses"`
}

type Role struct {
	ID          int32              `json:"id"`
	Name        string             `json:"name"`
	Description *string            `json:"description"`
	Permissions RolePermissions    `json:"permissions"`
	WorkspaceID uuid.UUID          `json:"workspace_id"`
	CreatedAt   pgtype.Timestamptz `json:"created_at"`
	CreatedByID uuid.UUID          `json:"created_by_id"`
}

type RolesUsersRelation struct {
	RoleID      int32     `json:"role_id"`
	UserID      uuid.UUID `json:"user_id"`
	WorkspaceID uuid.UUID `json:"workspace_id"`
}

type User struct {
	ID           uuid.UUID          `json:"id"`
	Deleted      *bool              `json:"deleted"`
	CreatedAt    pgtype.Timestamptz `json:"created_at"`
	Name         string             `json:"name"`
	Email        string             `json:"email"`
	Phone        string             `json:"phone"`
	Avatar       string             `json:"avatar"`
	Deactivated  *bool              `json:"deactivated"`
	Provider     string             `json:"provider"`
	Password     string             `json:"password"`
	RefreshToken string             `json:"refresh_token"`
}

type UserInvite struct {
	ID                uuid.UUID          `json:"id"`
	Deleted           *bool              `json:"deleted"`
	CreatedAt         pgtype.Timestamptz `json:"created_at"`
	WorkspaceID       uuid.UUID          `json:"workspace_id"`
	Name              string             `json:"name"`
	Email             string             `json:"email"`
	Status            int32              `json:"status"`
	PlainTextPassword *string            `json:"plain_text_password"`
}

type UsersWorkspacesRelation struct {
	UserID      uuid.UUID `json:"user_id"`
	WorkspaceID uuid.UUID `json:"workspace_id"`
}

type Workspace struct {
	ID          uuid.UUID          `json:"id"`
	Name        string             `json:"name"`
	Description *string            `json:"description"`
	Deleted     *bool              `json:"deleted"`
	CreatedAt   pgtype.Timestamptz `json:"created_at"`
	CreatedByID uuid.UUID          `json:"created_by_id"`
}

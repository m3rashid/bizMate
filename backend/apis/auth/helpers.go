package auth

import (
	"bizMate/repository"

	"github.com/gofiber/fiber/v2"
	"github.com/google/uuid"
	"github.com/jackc/pgx/v5/pgtype"
)

const (
	user_creation_failed  = "user_creation_failed"
	user_logout_failed    = "user_logout_failed"
	user_register_success = "user_register_success"
	user_login_success    = "user_login_success"

	user_not_found_by_id      = "user_not_found_by_id"
	invalid_credentials_login = "invalid_credentials_login"
	login_bad_request         = "login_bad_request"
	register_bad_request      = "register_bad_request"
	user_not_found_by_email   = "user_not_found_by_email"

	workspace_creation_failed      = "workspace_creation_failed"
	workspace_created_successfully = "workspace_created_successfully"
	workspace_not_found_by_id      = "workspace_not_found_by_id"
	workspace_not_found_by_user_id = "workspace_not_found_by_user_id"
	create_workspace_bad_request   = "create_workspace_bad_request"
)

type redisterBodyReq struct {
	Name     string `json:"name" validate:"required,min=3,max=50"`
	Email    string `json:"email" validate:"required,email,min=5,max=50"`
	Phone    string `json:"phone,omitempty"`
	Password string `json:"password" validate:"required,min=8,max=20"`
}

type loginBodyReq struct {
	Email    string `json:"email" validate:"required,email,min=3,max=50"`
	Password string `json:"password" validate:"required"`
}

type createWorkspaceReq struct {
	Name        string `json:"name" validate:"required,min=3,max=50"`
	Description string `json:"description" validate:"max=500"`
}

type partialUser struct {
	ID        uuid.UUID          `json:"id"`
	Name      string             `json:"name"`
	Email     string             `json:"email"`
	Avatar    string             `json:"avatar"`
	CreatedAt pgtype.Timestamptz `json:"createdAt"`
}

func toPartialUser(user repository.User) partialUser {
	return partialUser{
		ID:        user.ID,
		Name:      user.Name,
		Email:     user.Email,
		Avatar:    user.Avatar,
		CreatedAt: user.CreatedAt,
	}
}

func setTokenCookie(ctx *fiber.Ctx, token string) {
	ctx.Cookie(&fiber.Cookie{
		Name:     "token",
		Value:    "Bearer " + token,
		HTTPOnly: true,
	})
}

func removeCookie(ctx *fiber.Ctx) {
	ctx.ClearCookie("token")
}

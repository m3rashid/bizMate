package auth

import (
	"bizMate/repository"
	"bizMate/utils"

	"github.com/gofiber/fiber/v2"
	"github.com/google/uuid"
	"github.com/jackc/pgx/v5/pgtype"
)

const user_register_fail = "user_register_fail"
const user_register_success = "user_register_success"

const user_login_fail = "user_login_fail"
const user_login_success = "user_login_success"

const user_logout_fail = "user_logout_fail"
const user_logout_success = "user_logout_success"

const create_workspace_fail = "create_workspace_fail"
const create_workspace_success = "create_workspace_success"

const accept_workspace_invite_fail = "accept_workspace_invite_fail"
const accept_workspace_invite_success = "accept_workspace_invite_success"

const reject_workspace_invite_fail = "reject_workspace_invite_fail"
const reject_workspace_invite_success = "reject_workspace_invite_success"

const send_workspace_invite_fail = "send_workspace_invite_fail"
const send_workspace_invite_success = "send_workspace_invite_success"

const revoke_workspace_invite_fail = "revoke_workspace_invite_fail"
const revoke_workspace_invite_success = "revoke_workspace_invite_success"

const remove_user_from_workspace_fail = "remove_user_from_workspace_fail"
const remove_user_from_workspace_success = "remove_user_from_workspace_success"

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
	Color       string `json:"color" validate:"required"`
	Description string `json:"description" validate:"max=500"`
}

type acceptOrRejectWorkspaceInviteReq struct {
	InviteID uuid.UUID `json:"inviteId" validate:"required"`
	Accepted *bool     `json:"accepted" validate:"required"`
}

type sendWorkspaceInviteReq struct {
	Email string `json:"email" validate:"required,email"`
}

type revokeWorkspaceInviteReq struct {
	InviteID uuid.UUID `json:"inviteId" validate:"required"`
}

type removeUserFromWorkspaceReqBody struct {
	UserID uuid.UUID `json:"userId" validate:"required"`
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
		HTTPOnly: true,
		Name:     "token",
		Value:    "Bearer " + token,
		Secure:   *utils.Env.IsProduction,
		Domain:   utils.Ternary(*utils.Env.IsProduction, ".m3rashid.in", "localhost"),
	})
}

func removeCookie(ctx *fiber.Ctx) {
	ctx.ClearCookie("token")
}

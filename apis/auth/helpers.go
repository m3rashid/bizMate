package auth

import (
	"bizMate/repository"
	"bizMate/utils"
	"fmt"

	"github.com/gofiber/fiber/v2"
	"github.com/google/uuid"
	"github.com/jackc/pgx/v5/pgtype"
	"golang.org/x/crypto/bcrypt"
)

const user_login = "user_login"
const user_logout = "user_logout"
const user_register = "user_register"
const create_workspace = "create_workspace"
const send_workspace_invite = "send_workspace_invite"
const reject_workspace_invite = "reject_workspace_invite"
const accept_workspace_invite = "accept_workspace_invite"
const revoke_workspace_invite = "revoke_workspace_invite"
const remove_user_from_workspace = "remove_user_from_workspace"

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

func comparePasswords(hashedPassword string, password string) bool {
	if err := bcrypt.CompareHashAndPassword([]byte(hashedPassword), []byte(password)); err != nil {
		fmt.Println(err)
		return false
	}
	return true
}

func hashPassword(password string) (string, error) {
	bytes, err := bcrypt.GenerateFromPassword([]byte(password), 14)
	if err != nil {
		return "", err
	}

	return string(bytes), nil
}

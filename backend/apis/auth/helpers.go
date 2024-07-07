package auth

import (
	"bizMate/repository"
	"fmt"

	"github.com/google/uuid"
	"github.com/jackc/pgx/v5/pgtype"
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
	fmt.Printf("user: %+v\n", user)
	return partialUser{
		ID:        user.ID,
		Name:      user.Name,
		Email:     user.Email,
		Avatar:    user.Avatar,
		CreatedAt: user.CreatedAt,
	}
}

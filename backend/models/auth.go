package models

import (
	"time"
)

const USER_MODEL_NAME string = "users"
const WORKSPACE_MODEL_NAME string = "workspaces"
const USER_INVITE_MODEL_NAME string = "user_invites"

const PROVIDER_GOOGLE = "google"
const PROVIDER_CREDENTIALS = "credentials"

type Workspace struct {
	BaseModel
	OptionalCreatedBy
	Name  string  `gorm:"column:name" json:"name" validate:"required"`
	Users []*User `json:"users" gorm:"many2many:users_workspace_relation"`
}

type User struct {
	BaseModel
	Name         string `json:"name" gorm:"column:name;not null" validate:"required"`
	Email        string `json:"email" gorm:"column:email;unique;not null" validate:"required,email"`
	Phone        string `json:"phone" gorm:"column:phone"`
	Avatar       string `json:"avatar" gorm:"column:avatar"`
	Deactivated  bool   `json:"deactivated" gorm:"column:deactivated"`
	Provider     string `json:"provider" gorm:"column:provider;not null"`
	Password     string `json:"password" gorm:"column:password;not null" validate:"required"`
	RefreshToken string `json:"refreshToken" gorm:"refreshToken"`
}

var UserJsonModel = DashboardIndexableJsonModel{
	ModelName: USER_MODEL_NAME,
	Fields: map[string]JsonFieldType{
		"id":          JsonNumber,
		"name":        JsonString,
		"email":       JsonString,
		"phone":       JsonString,
		"createdAt":   JsonDate,
		"deactivated": JsonBool,
	},
}

type PartialUser struct {
	ID        string    `json:"id"`
	Name      string    `json:"name"`
	Email     string    `json:"email"`
	Avatar    string    `json:"avatar"`
	CreatedAt time.Time `json:"createdAt"`
}

func (user *User) ToPartialUser() PartialUser {
	return PartialUser{
		ID:        user.ID,
		Name:      user.Name,
		Email:     user.Email,
		Avatar:    user.Avatar,
		CreatedAt: user.CreatedAt,
	}
}

type UserInviteStatus int

const (
	InvitePending  UserInviteStatus = 0
	InviteAccepted UserInviteStatus = 1
	InviteDeclined UserInviteStatus = -1
)

type UserInvite struct {
	BaseModelWithWorkspace
	Name              string           `json:"name" gorm:"column:name;not null" validate:"required"`
	Email             string           `json:"email" gorm:"column:email;unique;not null" validate:"required,email"`
	Status            UserInviteStatus `json:"status" gorm:"column:status"`
	PlainTextPassword string           `json:"plainTextPassword" gorm:"column:plainTextPassword" validate:"required"`
}

var UserInviteJsonModel = DashboardIndexableJsonModel{
	ModelName: USER_INVITE_MODEL_NAME,
	Fields: map[string]JsonFieldType{
		"id":        JsonNumber,
		"name":      JsonString,
		"email":     JsonString,
		"createdAt": JsonDate,
		"status":    JsonNumber,
	},
}

func (Workspace) TableName() string {
	return WORKSPACE_MODEL_NAME
}

func (User) TableName() string {
	return USER_MODEL_NAME
}

func (UserInvite) TableName() string {
	return USER_INVITE_MODEL_NAME
}

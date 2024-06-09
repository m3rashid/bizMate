package models

import "github.com/gofiber/fiber/v2"

const USER_MODEL_NAME string = "users"
const PROFILE_MODEL_NAME string = "profiles"

const PROVIDER_CREDENTIALS = "credentials"
const PROVIDER_GOOGLE = "google"

type User struct {
	BaseModel
	Name         string `json:"name" gorm:"column:name;not null" validate:"required"`
	Email        string `json:"email" gorm:"column:email;unique;not null" validate:"required,email"`
	Phone        string `json:"phone,omitempty" gorm:"column:phone"`
	Avatar       string `json:"avatar,omitempty" gorm:"column:avatar"`
	Deactivated  bool   `json:"-" gorm:"column:deactivated"`
	Provider     string `json:"-" gorm:"column:provider"`
	Password     string `json:"-" gorm:"column:password;not null" validate:"required"`
	TenantOwner  bool   `json:"-" gorm:"column:tenantOwner"`
	RefreshToken string `json:"-" gorm:"refreshToken"`
}

func (user *User) ToPartialUser() fiber.Map {
	return fiber.Map{
		"id":        user.ID,
		"name":      user.Name,
		"email":     user.Email,
		"avatar":    user.Avatar,
		"createdAt": user.CreatedAt,
	}
}

type Profile struct {
	BaseModel
	UserID uint  `json:"userId" gorm:"column:userId;not null" validate:"required"`
	User   *User `json:"user" gorm:"column:userId;constraint:OnUpdate:CASCADE,OnDelete:CASCADE;"`
}

func (User) TableName() string {
	return USER_MODEL_NAME
}

func (Profile) TableName() string {
	return PROFILE_MODEL_NAME
}

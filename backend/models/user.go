package models

import (
	"github.com/gofiber/fiber/v2"
)

const USER_MODEL_NAME string = "users"

const PROVIDER_GOOGLE = "google"
const PROVIDER_CREDENTIALS = "credentials"

type User struct {
	BaseModel
	Name         string `json:"name" gorm:"column:name;not null" validate:"required"`
	Email        string `json:"email" gorm:"column:email;unique;not null" validate:"required,email"`
	Phone        string `json:"phone" gorm:"column:phone"`
	Avatar       string `json:"avatar" gorm:"column:avatar"`
	Deactivated  bool   `json:"deactivated" gorm:"column:deactivated"`
	Provider     string `json:"provider" gorm:"column:provider"`
	Password     string `json:"password" gorm:"column:password;not null" validate:"required"`
	TenantOwner  bool   `json:"tenantOwner" gorm:"column:tenantOwner;default:false"`
	RefreshToken string `json:"refreshToken" gorm:"refreshToken"`
}

var UserJsonModel = DashboardIndexableJsonModel{
	ModelName: USER_MODEL_NAME,
	Fields: map[string]JsonFieldType{
		"id":          JsonString,
		"name":        JsonString,
		"email":       JsonString,
		"phone":       JsonString,
		"createdAt":   JsonDate,
		"deactivated": JsonBool,
	},
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

func (User) TableName() string {
	return USER_MODEL_NAME
}

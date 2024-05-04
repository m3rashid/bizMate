package models

const USER_MODEL_NAME = "users"
const PROFILE_MODEL_NAME = "profiles"

const PROVIDER_CREDENTIALS = "credentials"
const PROVIDER_GOOGLE = "google"

type User struct {
	BaseModel
	Name         string `json:"name" gorm:"column:name;not null" validate:"required"`
	Email        string `json:"email" gorm:"column:email;unique;not null" validate:"required,email"`
	Phone        string `json:"phone,omitempty" gorm:"column:phone" validate:""`
	Avatar       string `json:"avatar,omitempty" gorm:"column:avatar" validate:""`
	Deactivated  bool   `json:"deactivated" gorm:"column:deactivated" validate:""`
	Provider     string `json:"provider" gorm:"column:provider" validate:""`
	Password     string `json:"password" gorm:"column:password;not null" validate:"required"`
	RefreshToken string `gorm:"refreshToken"`
}

type Profile struct {
	BaseModel
	UserID uint  `json:"userId" gorm:"column:userId;not null" validate:"required"`
	User   *User `json:"user" gorm:"column:userId;constraint:OnUpdate:CASCADE,OnDelete:CASCADE;" validate:""`
}

func (*User) TableName() string {
	return USER_MODEL_NAME
}

func (*Profile) TableName() string {
	return PROFILE_MODEL_NAME
}

func (u *User) Validate() error {
	return nil
}

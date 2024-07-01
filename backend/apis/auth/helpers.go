package auth

import (
	"bizMate/models"

	"gorm.io/gorm"
)

type redisterBodyReq struct {
	Name     string `json:"name" validate:"required"`
	Email    string `json:"email" validate:"required,email"`
	Phone    string `json:"phone,omitempty"`
	Password string `json:"password" validate:"required"`
}

type loginBodyReq struct {
	Email    string `json:"email" validate:"required,email"`
	Password string `json:"password" validate:"required"`
}

func createUserFromOauth(
	db *gorm.DB,
	user *models.User,
	otherTxs ...func(*gorm.DB, *models.User) error,
) error {
	return db.Transaction(func(tx *gorm.DB) error {
		if err := db.Create(user).Error; err != nil {
			return err
		}

		for _, otherTx := range otherTxs {
			if err := otherTx(tx, user); err != nil {
				return err
			}
		}

		return nil
	})
}

func acceptInvite() error {
	return nil
}

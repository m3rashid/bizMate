package auth

import (
	"bizMate/models"
	"bizMate/utils"
	"errors"

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

func createNewUser(
	name string,
	email string,
	plainTextPassword string,
	phone string,
	workspaceId uint, // if 0, then a new workspace is created
	provider string, // if "", credential provider is used
	refreshToken string,
	postTransactionActions ...func(*gorm.DB) error,
) (*models.User, error) {
	if provider != models.PROVIDER_GOOGLE && provider != models.PROVIDER_CREDENTIALS {
		return nil, errors.New("invalid provider")
	}

	if provider == models.PROVIDER_CREDENTIALS && plainTextPassword == "" {
		return nil, errors.New("password is required")
	}

	if provider == models.PROVIDER_GOOGLE && refreshToken == "" {
		return nil, errors.New("refresh token is required")
	}

	user := models.User{
		Name:     name,
		Email:    email,
		Phone:    phone,
		Provider: provider,
	}

	if provider == models.PROVIDER_CREDENTIALS {
		password, err := utils.HashPassword(plainTextPassword)
		if err != nil {
			return nil, err
		}
		user.Password = password
	} else {
		user.RefreshToken = refreshToken
	}

	db, err := utils.GetDB()
	if err != nil {
		return nil, err
	}

	err = db.Transaction(func(tx *gorm.DB) error {
		workspace := models.Workspace{
			Name:     name + "'s workspace",
			UniqueID: utils.GenerateUuid(),
		}

		if workspaceId == 0 {
			if err := db.Create(&workspace).Error; err != nil {
				return err
			}

			user.WorkspaceID = workspace.ID
		} else {
			user.WorkspaceID = workspaceId
		}

		if err := db.Create(&user).Error; err != nil {
			return err
		}

		if workspaceId == 0 {
			workspace.OptionalCreatedBy = models.OptionalCreatedBy{CreatedByID: &user.ID}
			if err := db.Save(&workspace).Error; err != nil {
				return err
			}
		}

		for _, action := range postTransactionActions {
			if err := action(tx); err != nil {
				return err
			}
		}

		return nil
	})

	if err != nil {
		return nil, err
	}

	return &user, nil
}

func handleInvite(inviteId uint, nextStatus models.UserInviteStatus, authProvider string, refreshToken string) (*models.User, error) {
	db, err := utils.GetDB()
	if err != nil {
		return nil, err
	}

	invite := models.UserInvite{}
	if err := db.Where("id = ?", inviteId).First(&invite).Error; err != nil {
		return nil, err
	}

	if invite.Status != models.InvitePending {
		return nil, errors.New("invalid invite status")
	}

	if nextStatus == models.InviteAccepted {
		createNewUser(invite.Name, invite.Email, invite.PlainTextPassword, "", invite.WorkspaceID, authProvider, refreshToken, func(tx *gorm.DB) error {
			invite.Status = models.InviteAccepted
			return tx.Save(&invite).Error
		})
	}

	return nil, nil
}

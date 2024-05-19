package forms

import (
	"bizmate/apis/notifications"
	"bizmate/models"
	"fmt"

	"gorm.io/gorm"
)

// TODO: create a form response template

func sendResponseEmail(form models.Form, formResponse models.FormResponse, userId uint, db *gorm.DB) {
	if userId == 0 || db == nil {
		return
	}

	user := models.User{}
	if err := db.Where("id = ?", userId).First(&user).Error; err != nil {
		return
	}

	email := notifications.Email{
		To:      []string{user.Email},
		Subject: fmt.Sprintf("Form Response: %s", form.Title),
		Body:    []byte(formResponse.Response),
	}

	go email.Send()
}

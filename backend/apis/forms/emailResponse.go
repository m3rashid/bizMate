package forms

import (
	"bizMate/apis/notifications"
	"bizMate/models"
	"fmt"

	"gorm.io/gorm"
)

// TODO: create a form response template

func sendResponseEmail(form models.Form, formResponse models.FormResponse, userId string, db *gorm.DB) {
	if userId == "" || db == nil {
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

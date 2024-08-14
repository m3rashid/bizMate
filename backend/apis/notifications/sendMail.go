package notifications

import (
	"bizMate/utils"
	"fmt"
	"net/smtp"
	"strings"
)

var smtpPort = "587"
var smtpHost = "smtp.gmail.com"

type Email struct {
	To      []string
	Subject string
	Body    []byte
}

func (email *Email) getFormatBody() []byte {
	return []byte(
		"From: " + utils.Env.GmailAddress + "\n" +
			"To: " + strings.Join(email.To, ",") + "\n" +
			"Subject: " + email.Subject + "\n" +
			"Content-Type: text/html;" + " \n\n" + string(email.Body),
	)
}

func (email *Email) Send() {
	if len(email.To) == 0 || len(email.Body) == 0 {
		return
	}

	smtpAuth := smtp.PlainAuth("", utils.Env.GmailAddress, utils.Env.GmailPassword, smtpHost)

	if err := smtp.SendMail(
		smtpHost+":"+smtpPort,
		smtpAuth,
		utils.Env.GmailAddress,
		email.To,
		email.getFormatBody(),
	); err != nil {
		fmt.Println("Error in sending email", err.Error())
		return
	}
}

package notifications

import (
	"fmt"
	"net/smtp"
	"os"
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
		"From: " + os.Getenv("GMAIL_ADDRESS") + "\n" +
			"To: " + strings.Join(email.To, ",") + "\n" +
			"Subject: " + email.Subject + "\n" +
			"Content-Type: text/html;" + " \n\n" + string(email.Body),
	)
}

func (email *Email) Send() {
	if len(email.To) == 0 || len(email.Body) == 0 {
		return
	}

	senderEmail := os.Getenv("GMAIL_ADDRESS")
	senderPassword := os.Getenv("GMAIL_PASSWORD")

	smtpAuth := smtp.PlainAuth("", senderEmail, senderPassword, smtpHost)
	if err := smtp.SendMail(smtpHost+":"+smtpPort, smtpAuth, senderEmail, email.To, email.getFormatBody()); err != nil {
		fmt.Println("Error in sending email", err.Error())
		return
	}
}

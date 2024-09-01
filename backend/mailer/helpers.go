package mailer

import (
	"fmt"
	"net"
	"net/smtp"
	"strings"
)

const verificationSenderEmail = "coold1741@gmail.com"
const verificationHeloDomain = "gmail.com"

func VerifyEmailValid(targetEmail string) bool {
	parts := strings.Split(targetEmail, "@")
	if len(parts) != 2 {
		return false
	}
	domain := parts[1]

	// Perform a DNS lookup for MX records
	mxRecords, err := net.LookupMX(domain)
	if err != nil || len(mxRecords) == 0 {
		return false
	}

	// Connect to the SMTP server
	server := mxRecords[0].Host
	client, err := smtp.Dial(fmt.Sprintf("%s:25", server))
	if err != nil {
		return false
	}
	defer client.Close()

	// Initiate the SMTP conversation
	client.Hello(verificationHeloDomain)
	client.Mail(verificationSenderEmail)
	err = client.Rcpt(targetEmail)
	return err == nil
}

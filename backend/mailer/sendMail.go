package mailer

import (
	"bizMate/utils"
	"context"
	"fmt"

	"github.com/aws/aws-sdk-go-v2/aws"
	"github.com/aws/aws-sdk-go-v2/config"
	"github.com/aws/aws-sdk-go-v2/service/ses"
	"github.com/aws/aws-sdk-go-v2/service/ses/types"
)

type Mail struct {
	To       []string
	Subject  string
	BodyText string
	BodyHtml string
}

const charSet = "UTF-8"

func (mail Mail) Send() error {
	cfg, err := config.LoadDefaultConfig(context.TODO(), config.WithRegion(utils.Env.AwsRegion), config.WithSharedConfigProfile(""))
	if err != nil {
		return fmt.Errorf("failed to load AWS configuration: %w", err)
	}

	sesClient := ses.NewFromConfig(cfg)

	input := &ses.SendEmailInput{
		Destination: &types.Destination{ToAddresses: mail.To},
		Message:     &types.Message{},
		Source:      aws.String("bizmailer@m3rashid.in"),
	}

	if mail.BodyText != "" {
		input.Message.Body = &types.Body{
			Text: &types.Content{
				Charset: aws.String(charSet),
				Data:    aws.String(mail.BodyText),
			},
		}
	}

	if mail.BodyHtml != "" {
		input.Message.Body = &types.Body{
			Html: &types.Content{
				Charset: aws.String(charSet),
				Data:    aws.String(mail.BodyHtml),
			},
		}
	}

	res, err := sesClient.SendEmail(context.TODO(), input)
	if err != nil {
		return err
	}

	fmt.Printf("Email sent successfully. MessageID: %s\n", *res.MessageId)
	return nil
}

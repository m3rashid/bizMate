package utils

import (
	"context"
	"os"
	"time"

	"github.com/aws/aws-sdk-go-v2/aws"
	"github.com/aws/aws-sdk-go-v2/config"
	"github.com/aws/aws-sdk-go-v2/service/s3"
)

var awsConfig *aws.Config

func newConfig() (aws.Config, error) {
	if awsConfig == nil {
		cfg, err := config.LoadDefaultConfig(context.Background(), config.WithRegion(os.Getenv("AWS_REGION")), config.WithSharedConfigProfile(""))
		if err != nil {
			return aws.Config{}, err
		}

		awsConfig = &cfg
	}
	return *awsConfig, nil
}

func GetPresignURL() (string, error) {
	cfg, err := newConfig()
	if err != nil {
		return "", err
	}
	s3client := s3.NewFromConfig(cfg)
	presignClient := s3.NewPresignClient(s3client)
	presignedUrl, err := presignClient.PresignGetObject(context.Background(), &s3.GetObjectInput{
		Bucket: aws.String(os.Getenv("AWS_BUCKET_NAME")),
		Key:    aws.String(RandomString32()),
	}, s3.WithPresignExpires(time.Minute*15))
	if err != nil {
		return "", err
	}
	return presignedUrl.URL, nil
}

func PutPresignURL(key string) (string, error) {
	cfg, err := newConfig()
	if err != nil {
		return "", err
	}
	s3client := s3.NewFromConfig(cfg)
	presignClient := s3.NewPresignClient(s3client)
	presignedUrl, err := presignClient.PresignPutObject(context.Background(), &s3.PutObjectInput{
		Bucket: aws.String(os.Getenv("AWS_BUCKET_NAME")),
		Key:    aws.String(key),
	}, s3.WithPresignExpires(time.Minute*15))
	if err != nil {
		return "", err
	}
	return presignedUrl.URL, nil
}

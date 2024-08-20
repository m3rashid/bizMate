package utils

import (
	"fmt"
	"os"

	"github.com/joho/godotenv"
)

type Environment struct {
	Port         string
	AppName      string
	ServerMode   string
	IsProduction *bool

	RedisUrl          string
	PostgresUrl       string
	MongoUrl          string
	MongoDatabaseName string

	GmailPassword           string
	GmailAddress            string
	GoogleOauthCallbackUrl  string
	GoogleOauthClientId     string
	GoogleOauthClientSecret string
	AuthClientCallback      string

	StripePublicKey  string
	StripePrivateKey string

	AwsRegion          string
	AwsBucketName      string
	AwsAccessKeyId     string
	AwsSecretAccessKey string

	SeedDefaultPassword string
	SessionSecret       string
}

var Env Environment

func getEnv(key string, defaultValue ...string) string {
	value := os.Getenv(key)
	if value == "" && len(defaultValue) > 0 {
		return defaultValue[0]
	}

	return value
}

func SetupEnv() {
	err := godotenv.Load(".env.local") // this will fail in production because we set environment variables in the server directly
	if err != nil {
		fmt.Println("Error loading .env file")
	}

	serverMode := getEnv("SERVER_MODE", "development")
	isProduction := serverMode == "production"

	serverEnv := Environment{
		Port:         getEnv("PORT", "4000"),
		AppName:      getEnv("APP_NAME", "bizMate"),
		ServerMode:   serverMode,
		IsProduction: &isProduction,

		RedisUrl:          getEnv("REDIS_URL", "redis::6379"),
		PostgresUrl:       getEnv("POSTGRES_URI", "postgres://genos:genos@postgresdb:5432/bizmatedb"),
		MongoUrl:          getEnv("MONGO_URI", "mongodb://genos:genos@mongodb:27017/bizmatedb?ssl=false&authSource=admin"),
		MongoDatabaseName: getEnv("MONGO_DATABASE_NAME", "bizmatedb"),

		GmailPassword:           getEnv("GMAIL_PASSWORD"),
		GmailAddress:            getEnv("GMAIL_ADDRESS"),
		GoogleOauthCallbackUrl:  getEnv("GOOGLE_OAUTH_CALLBACK_URL", "http://localhost:4000/auth/google/callback"),
		GoogleOauthClientId:     getEnv("GOOGLE_OAUTH_CLIENT_ID"),
		GoogleOauthClientSecret: getEnv("GOOGLE_OAUTH_CLIENT_SECRET"),
		AuthClientCallback:      getEnv("AUTH_CLIENT_CALLBACK", "http://localhost:3000/auth/login"),

		StripePublicKey:  getEnv("STRIPE_PUBLIC_KEY"),
		StripePrivateKey: getEnv("STRIPE_PRIVATE_KEY"),

		AwsRegion:          getEnv("AWS_REGION"),
		AwsBucketName:      getEnv("AWS_BUCKET_NAME"),
		AwsAccessKeyId:     getEnv("AWS_ACCESS_KEY_ID"),
		AwsSecretAccessKey: getEnv("AWS_SECRET_ACCESS_KEY"),

		SeedDefaultPassword: getEnv("SEED_DEFAULT_PASSWORD"),
		SessionSecret:       getEnv("SESSION_SECRET"),
	}
	Env = serverEnv
}

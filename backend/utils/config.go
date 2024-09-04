package utils

import (
	"fmt"
	"os"
	"path/filepath"
	"time"

	"github.com/gofiber/contrib/fiberi18n/v2"
	"github.com/gofiber/fiber/v2"
	"github.com/gofiber/fiber/v2/middleware/cors"
	"github.com/gofiber/fiber/v2/middleware/favicon"
	"github.com/gofiber/fiber/v2/middleware/limiter"
	"github.com/joho/godotenv"
	"golang.org/x/text/language"
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

type PublicFolderConfig struct {
	Path   string
	Config fiber.Static
}

type Server struct {
	ExecDir            string
	AppConfig          fiber.Config
	CorsConfig         cors.Config
	FaviconConfig      favicon.Config
	RateLimitConfig    limiter.Config
	I18nConfig         fiberi18n.Config
	PublicFolderConfig PublicFolderConfig
}

func NewServer() (Server, error) {
	exePath, err := os.Executable()
	if err != nil {
		return Server{}, err
	}
	exeDir := filepath.Dir(exePath)

	return Server{
		ExecDir:            exeDir,
		AppConfig:          getFiberConfig(),
		CorsConfig:         getCorsConfig(),
		FaviconConfig:      getFaviconConfig(exeDir),
		RateLimitConfig:    getRateLimitConfig(),
		I18nConfig:         getI18nConfig(exeDir),
		PublicFolderConfig: getPublicConfig(exeDir),
	}, nil
}

func getFiberConfig() fiber.Config {
	return fiber.Config{
		CaseSensitive:         true,
		PassLocalsToViews:     true,
		AppName:               Env.AppName,
		RequestMethods:        []string{"GET", "POST", "HEAD", "OPTIONS"},
		Concurrency:           256 * 1024 * 1024,
		ServerHeader:          Env.AppName,
		DisableStartupMessage: true,
		ErrorHandler: func(ctx *fiber.Ctx, err error) error {
			code := fiber.StatusInternalServerError
			if e, ok := err.(*fiber.Error); ok {
				code = e.Code
			}
			return ctx.Status(code).JSON(fiber.Map{
				"data":    nil,
				"success": false,
				"message": Ternary(err.Error() != "", err.Error(), "Something went wrong!"),
			})
		},
	}
}

func getCorsConfig() cors.Config {
	return cors.Config{
		AllowCredentials: true,
		AllowOrigins:     Ternary(*Env.IsProduction, "https://bizmate.m3rashid.in", "http://localhost:3000"),
	}
}

func getFaviconConfig(exeDir string) favicon.Config {
	return favicon.Config{
		URL:  "/favicon.ico",
		File: Ternary(*Env.IsProduction, filepath.Join(exeDir, "public/icons/favicon.ico"), "./public/icons/favicon.ico"),
	}
}

func getRateLimitConfig() limiter.Config {
	return limiter.Config{
		Max:               100,
		Expiration:        1 * time.Minute,
		LimiterMiddleware: limiter.SlidingWindow{},
	}
}

func getI18nConfig(exeDir string) fiberi18n.Config {
	return fiberi18n.Config{
		FormatBundleFile: "json",
		RootPath:         Ternary(*Env.IsProduction, filepath.Join(exeDir, "i18n"), "./i18n"),
		DefaultLanguage:  language.English,
		AcceptLanguages:  []language.Tag{language.English, language.Hindi},
	}
}

func getPublicConfig(exeDir string) PublicFolderConfig {
	return PublicFolderConfig{
		Path:   Ternary(*Env.IsProduction, filepath.Join(exeDir, "public"), "./public"),
		Config: fiber.Static{MaxAge: 3600, CacheDuration: 10 * time.Second},
	}
}

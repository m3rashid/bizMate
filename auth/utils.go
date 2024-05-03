package auth

import (
	"fmt"
	"os"
	"strconv"
	"time"

	"github.com/gofiber/fiber/v2"
	"github.com/golang-jwt/jwt/v5"
	"golang.org/x/crypto/bcrypt"
)

func HashPassword(password string) (string, error) {
	bytes, err := bcrypt.GenerateFromPassword([]byte(password), 14)
	if err != nil {
		return "", err
	}

	return string(bytes), nil
}

func VerifyPassword(hashedPassword string, password string) bool {
	err := bcrypt.CompareHashAndPassword([]byte(hashedPassword), []byte(password))
	check := true

	if err != nil {
		check = false
	}

	return check
}

type Claims struct {
	Email  string `json:"email"`
	UserID string `json:"userId"`
	jwt.RegisteredClaims
}

func GenerateJWT(userId uint, email string) (string, error) {
	expirationTime := time.Now().Add(24 * time.Hour)
	claims := &Claims{
		Email:  email,
		UserID: strconv.FormatUint(uint64(userId), 10),
		RegisteredClaims: jwt.RegisteredClaims{
			ExpiresAt: jwt.NewNumericDate(expirationTime),
		},
	}

	token := jwt.NewWithClaims(jwt.SigningMethodHS256, claims)
	tokenString, err := token.SignedString([]byte(os.Getenv("JWT_SECRET")))
	if err != nil {
		return "", err
	}

	return tokenString, nil
}

func CheckAuth(tokenString string) (*Claims, error) {
	if len(tokenString) < 7 {
		return &Claims{}, nil
	}

	clientToken := tokenString[7:]
	token, err := jwt.ParseWithClaims(
		clientToken,
		&Claims{},
		func(token *jwt.Token) (interface{}, error) {
			return []byte(os.Getenv("JWT_SECRET")), nil
		},
	)

	if err != nil {
		return &Claims{}, err
	}

	claims, ok := token.Claims.(*Claims)
	if !ok {
		return &Claims{}, err
	}
	return claims, nil
}

func CheckAuthMiddleware() fiber.Handler {
	return func(c *fiber.Ctx) error {
		clientToken := c.Get("Authorization")
		if clientToken == "" {
			return c.Status(fiber.StatusUnauthorized).SendString("No Authorization header provided")
		}

		claims, err := CheckAuth(clientToken)
		if err != nil {
			c.Status(fiber.StatusUnauthorized).SendString(err.Error())
		}

		userIdU64, err := strconv.ParseUint(claims.UserID, 10, 32)
		if err != nil {
			return fmt.Errorf("error parsing user id: %v", err)
		}

		c.Locals("email", claims.Email)
		c.Locals("userId", uint(userIdU64))
		c.Locals("authorized", true)

		return c.Next()
	}
}

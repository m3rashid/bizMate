package utils

import (
	"fmt"
	"os"
	"strconv"

	"github.com/gofiber/fiber/v2"
	"github.com/golang-jwt/jwt/v5"
)

type Claims struct {
	Email  string `json:"email"`
	UserID string `json:"userId"`
	jwt.RegisteredClaims
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

func CheckAuthMiddleware(c *fiber.Ctx) error {
	clientToken := c.Get("Authorization")
	if clientToken == "" {
		return c.Status(fiber.StatusUnauthorized).SendString("No Authorization header provided")
	}

	claims, err := CheckAuth(clientToken)
	if err != nil {
		c.Status(fiber.StatusUnauthorized).JSON(fiber.Map{"error": err.Error()})
	}

	userIdU64, err := strconv.ParseUint(claims.UserID, 10, 32)
	if err != nil {
		return fmt.Errorf("error parsing user id: %v", err)
	}

	c.Locals("email", claims.Email)
	c.Locals("userId", uint(userIdU64))
	c.Locals("authorized", userIdU64 != 0)

	return c.Next()
}

// Too much duplicated code, refactor it
func CheckAuthMiddlewareButAllowUnauthorized(ctx *fiber.Ctx) error {
	clientToken := ctx.Get("Authorization")
	if clientToken == "" {
		return ctx.Next()
	}

	claims, err := CheckAuth(clientToken)
	if err != nil {
		return ctx.Next()
	}

	userIdU64, err := strconv.ParseUint(claims.UserID, 10, 32)
	if err != nil {
		return fmt.Errorf("error parsing user id: %v", err)
	}

	ctx.Locals("email", claims.Email)
	ctx.Locals("userId", uint(userIdU64))
	ctx.Locals("authorized", userIdU64 != 0)

	return ctx.Next()
}

func GetUserIdOrNullFromCtxMaybe(ctx *fiber.Ctx) uint {
	userIdStr := ctx.Locals("userId")
	fmt.Println("userIdStr", userIdStr)
	if userIdStr == nil {
		return 0
	}

	userId, ok := userIdStr.(uint)
	if !ok {
		return 0
	}

	return userId
}

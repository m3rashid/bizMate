package utils

import (
	"fmt"
	"os"
	"strconv"
	"time"

	"github.com/gofiber/fiber/v2"
	"github.com/golang-jwt/jwt/v5"
	"golang.org/x/crypto/bcrypt"
)

type Claims struct {
	Email       string `json:"email"`
	UserID      string `json:"userId"`
	WorkspaceID string `json:"workspaceId"`
	jwt.RegisteredClaims
}

func CheckAuthMiddleware(ctx *fiber.Ctx) error {
	clientToken := ctx.Get("Authorization")
	if clientToken == "" {
		return ctx.SendStatus(fiber.StatusUnauthorized)
	}

	claims, err := parseTokenToClaims(clientToken)
	if err != nil {
		return ctx.SendStatus(fiber.StatusUnauthorized)
	}

	if err := parseAndSetAuthLocals(claims, ctx, true); err != nil {
		return ctx.SendStatus(fiber.StatusUnauthorized)
	}

	return ctx.Next()
}

func CheckAuthMiddlewareButAllowUnauthorized(ctx *fiber.Ctx) error {
	clientToken := ctx.Get("Authorization")
	if clientToken == "" {
		return ctx.Next()
	}

	claims, err := parseTokenToClaims(clientToken)
	if err != nil {
		return ctx.Next()
	}

	if err := parseAndSetAuthLocals(claims, ctx, false); err != nil {
		return ctx.SendStatus(fiber.StatusUnauthorized)
	}

	return ctx.Next()
}

func getId(ctx *fiber.Ctx, key string) uint {
	_id := ctx.Locals(key)
	if _id == nil {
		return 0
	}

	id, ok := _id.(uint)
	if !ok {
		return 0
	}
	return id
}

func GetUserAndWorkspaceIdsOrZero(ctx *fiber.Ctx) (userId uint, workspaceId uint) {
	return getId(ctx, "userId"), getId(ctx, "workspaceId")
}

func GenerateJWT(userId uint, workspaceId uint, email string) (string, error) {
	expirationTime := time.Now().Add(24 * time.Hour)
	claims := &Claims{
		Email:            email,
		UserID:           strconv.FormatUint(uint64(userId), 10),
		WorkspaceID:      strconv.FormatUint(uint64(workspaceId), 10),
		RegisteredClaims: jwt.RegisteredClaims{ExpiresAt: jwt.NewNumericDate(expirationTime)},
	}

	token := jwt.NewWithClaims(jwt.SigningMethodHS256, claims)
	tokenString, err := token.SignedString([]byte(os.Getenv("JWT_SECRET")))
	if err != nil {
		return "", err
	}

	return tokenString, nil
}

func ComparePasswords(hashedPassword string, password string) bool {
	if err := bcrypt.CompareHashAndPassword([]byte(hashedPassword), []byte(password)); err != nil {
		fmt.Println(err)
		return false
	}
	return true
}

func HashPassword(password string) (string, error) {
	bytes, err := bcrypt.GenerateFromPassword([]byte(password), 14)
	if err != nil {
		return "", err
	}

	return string(bytes), nil
}

func parseTokenToClaims(tokenString string) (*Claims, error) {
	if len(tokenString) < 7 {
		return &Claims{}, nil
	}

	clientToken := tokenString[7:]
	token, err := jwt.ParseWithClaims(clientToken, &Claims{}, func(token *jwt.Token) (interface{}, error) {
		return []byte(os.Getenv("JWT_SECRET")), nil
	})
	if err != nil {
		return &Claims{}, err
	}

	claims, ok := token.Claims.(*Claims)
	if !ok {
		return &Claims{}, err
	}
	return claims, nil
}

func parseAndSetAuthLocals(claims *Claims, ctx *fiber.Ctx, throwErrorOnAuthFail bool) error {
	userIdU64, err := strconv.ParseUint(claims.UserID, 10, 32)
	if err != nil {
		return fmt.Errorf("error parsing user id: %+v", err)
	}

	workspaceIdU64, err := strconv.ParseUint(claims.WorkspaceID, 10, 32)
	if err != nil {
		return fmt.Errorf("error parsing workspace id: %+v", err)
	}

	ctx.Locals("email", claims.Email)
	ctx.Locals("userId", uint(userIdU64))
	ctx.Locals("workspaceId", uint(workspaceIdU64))
	ctx.Locals("authorized", userIdU64 != 0)

	if throwErrorOnAuthFail && userIdU64 == 0 {
		return fmt.Errorf("unauthorized")
	}

	return nil
}

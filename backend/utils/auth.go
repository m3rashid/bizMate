package utils

import (
	"fmt"
	"os"
	"time"

	"github.com/gofiber/fiber/v2"
	"github.com/golang-jwt/jwt/v5"
	"github.com/google/uuid"
	"golang.org/x/crypto/bcrypt"
)

type Claims struct {
	Email  string `json:"email"`
	UserID string `json:"userId"`
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

func getId(key string, ctx *fiber.Ctx) uuid.UUID {
	_id := ctx.Locals(key)
	if _id == nil {
		return uuid.Nil
	}

	id, ok := _id.(uuid.UUID)
	if !ok {
		return uuid.Nil
	}
	return id
}

func GetUserAndWorkspaceIdsOrZero(ctx *fiber.Ctx) (userId uuid.UUID, workspaceId uuid.UUID) {
	return getId("userId", ctx), getId("workspaceId", ctx)
}

func GenerateJWT(userId string, email string) (string, error) {
	expirationTime := time.Now().Add(24 * time.Hour)
	claims := &Claims{
		Email:            email,
		UserID:           userId,
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
	wId := ctx.Params("workspaceId")
	if wId == "" || claims.UserID == "" {
		return fmt.Errorf("workspace id not found")
	}

	userId, err := uuid.Parse(claims.UserID)
	if err != nil {
		return fmt.Errorf("error parsing user id: %+v", err)
	}

	workspaceId, err := uuid.Parse(wId)
	if err != nil {
		return fmt.Errorf("error parsing workspace id: %+v", err)
	}

	ctx.Locals("email", claims.Email)
	ctx.Locals("userId", userId)
	ctx.Locals("workspaceId", workspaceId)
	ctx.Locals("authorized", userId != uuid.Nil && workspaceId != uuid.Nil)

	if throwErrorOnAuthFail && userId == uuid.Nil && workspaceId == uuid.Nil {
		return fmt.Errorf("unauthorized")
	}

	return nil
}

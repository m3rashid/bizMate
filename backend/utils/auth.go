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

func parseAndGetAuthLocals(claims *Claims, ctx *fiber.Ctx) (uuid.UUID, uuid.UUID) {
	var userId uuid.UUID
	var workspaceId uuid.UUID

	wId := ctx.Params("workspaceId")
	if wId != "" {
		_workspaceId, err := uuid.Parse(wId)
		if err != nil {
			_workspaceId = uuid.Nil
		}
		workspaceId = _workspaceId
	}

	_userId, err := uuid.Parse(claims.UserID)
	if err != nil {
		_userId = uuid.Nil
	}
	userId = _userId

	return userId, workspaceId
}

func setAuthLocals(ctx *fiber.Ctx, email string, userId uuid.UUID, workspaceId uuid.UUID, authorized bool) {
	ctx.Locals("email", email)
	ctx.Locals("userId", userId)
	ctx.Locals("workspaceId", workspaceId)
	ctx.Locals("authorized", authorized)
}

func getClaims(ctx *fiber.Ctx) *Claims {
	clientToken := ctx.Get("Authorization")
	if clientToken == "" {
		return nil
	}

	claims, err := parseTokenToClaims(clientToken)
	if err != nil {
		return nil
	}
	return claims
}

func CheckAuthMiddlewareWithoutWorkspace(ctx *fiber.Ctx) error {
	claims := getClaims(ctx)
	if claims == nil {
		return ctx.SendStatus(fiber.StatusUnauthorized)
	}

	userId, _ := parseAndGetAuthLocals(claims, ctx)
	if userId == uuid.Nil {
		return ctx.SendStatus(fiber.StatusUnauthorized)
	}

	setAuthLocals(ctx, claims.Email, userId, uuid.Nil, true)
	return ctx.Next()
}

func CheckAuthMiddlewareWithWorkspace(ctx *fiber.Ctx) error {
	claims := getClaims(ctx)
	if claims == nil {
		return ctx.SendStatus(fiber.StatusUnauthorized)
	}

	userId, workspaceId := parseAndGetAuthLocals(claims, ctx)
	if userId == uuid.Nil || workspaceId == uuid.Nil {
		return ctx.SendStatus(fiber.StatusUnauthorized)
	}

	setAuthLocals(ctx, claims.Email, userId, workspaceId, true)
	return ctx.Next()
}

func CheckAuthMiddlewareButAllowUnauthorized(ctx *fiber.Ctx) error {
	claims := getClaims(ctx)
	if claims == nil {
		return ctx.Next()
	}

	userId, workspaceId := parseAndGetAuthLocals(claims, ctx)
	if userId == uuid.Nil {
		return ctx.SendStatus(fiber.StatusUnauthorized)
	}

	authorized := userId != uuid.Nil && workspaceId != uuid.Nil
	setAuthLocals(ctx, claims.Email, userId, workspaceId, authorized)

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

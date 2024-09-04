package utils

import (
	"fmt"
	"time"

	"github.com/gofiber/fiber/v2"
	"github.com/golang-jwt/jwt/v5"
	"github.com/google/uuid"
)

type Claims struct {
	Email  string `json:"email"`
	UserID string `json:"userId"`
	Avatar string `json:"avatar"`
	jwt.RegisteredClaims
}

func GetUserEmailFromCtx(ctx *fiber.Ctx) string {
	email := ctx.Locals("email")
	if email == nil {
		return ""
	}
	return email.(string)
}

func GetUserAndWorkspaceIdsOrZero(ctx *fiber.Ctx) (userId uuid.UUID, workspaceId uuid.UUID) {
	return getId("userId", ctx), getId("workspaceId", ctx)
}

func GenerateJWT(userId uuid.UUID, email string, avatar string) (string, error) {
	expirationTime := time.Now().Add(24 * time.Hour)
	claims := &Claims{
		Email:  email,
		Avatar: avatar,
		UserID: userId.String(),
		RegisteredClaims: jwt.RegisteredClaims{
			ExpiresAt: jwt.NewNumericDate(expirationTime),
			IssuedAt:  jwt.NewNumericDate(time.Now()),
		},
	}

	token := jwt.NewWithClaims(jwt.SigningMethodHS256, claims)
	tokenString, err := token.SignedString([]byte(Env.SessionSecret))
	if err != nil {
		return "", err
	}

	return tokenString, nil
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

func setAuthLocals(
	ctx *fiber.Ctx,
	email string,
	userId uuid.UUID,
	workspaceId uuid.UUID,
	authorized bool,
) {
	ctx.Locals("email", email)
	ctx.Locals("userId", userId)
	ctx.Locals("workspaceId", workspaceId)
	ctx.Locals("authorized", authorized)
}

func getClaims(ctx *fiber.Ctx) *Claims {
	token := ""
	tokenFromCookie := ctx.Cookies("token", "")
	tokenFromHeader := ctx.Get("Authorization", "")

	if tokenFromCookie != "" {
		token = tokenFromCookie
	} else if tokenFromHeader != "" {
		token = tokenFromHeader
	} else {
		return nil
	}

	claims, err := parseTokenToClaims(token)
	if err != nil {
		fmt.Println("parseTokenToClaims(token): ", err)
		return nil
	}
	return claims
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

func parseTokenToClaims(tokenString string) (*Claims, error) {
	if len(tokenString) < 7 {
		return &Claims{}, nil
	}

	clientToken := tokenString[7:]
	token, err := jwt.ParseWithClaims(clientToken, &Claims{}, func(token *jwt.Token) (interface{}, error) {
		return []byte(Env.SessionSecret), nil
	})
	if err != nil {
		return &Claims{}, err
	}

	// check if the token has not expired

	claims, ok := token.Claims.(*Claims)
	if !ok {
		return &Claims{}, err
	}
	return claims, nil
}

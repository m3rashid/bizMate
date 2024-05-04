package auth

import (
	"bizmate/models"
	"bizmate/utils"
	"errors"
	"fmt"
	"os"
	"strconv"
	"time"

	"github.com/golang-jwt/jwt/v5"
	"golang.org/x/crypto/bcrypt"
	"gorm.io/gorm"
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

func GenerateJWT(userId uint, email string) (string, error) {
	expirationTime := time.Now().Add(24 * time.Hour)
	claims := &utils.Claims{
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

func createUser(db *gorm.DB, user *models.User) error {
	if err := db.Create(user).Error; err != nil {
		fmt.Println(err)
		return errors.New("error=cant_create_user")
	}
	return nil
}

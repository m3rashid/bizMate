package auth

import "fmt"

func NewToken() (string, error) {
	return "", fmt.Errorf("NewToken not implemented")
}

func ValidateToken(token string) (bool, error) {
	return false, fmt.Errorf("ValidateToken not implemented")
}

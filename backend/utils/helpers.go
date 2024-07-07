package utils

import (
	"encoding/json"
	"math/rand"
	"strings"
	"unicode"

	"github.com/google/uuid"
	"golang.org/x/exp/constraints"
	"golang.org/x/text/cases"
	"golang.org/x/text/language"
)

func Includes[SliceType constraints.Ordered](array []SliceType, element SliceType) bool {
	for _, item := range array {
		if item == element {
			return true
		}
	}
	return false
}

func Ternary[T any](condition bool, trueVal T, falseVal T) T {
	if condition {
		return trueVal
	}
	return falseVal
}

func CapitalizeFirstLetter(str string) string {
	return cases.Title(language.English, cases.Compact).String(str)
}

func CamelCaseToSentenceCase(str string) string {
	splitWords := []string{}

	currentWord := ""
	for i, letter := range str {
		if unicode.IsUpper(letter) && i > 0 {
			splitWords = append(splitWords, CapitalizeFirstLetter(currentWord))
			currentWord = ""
		}
		currentWord += string(letter)
	}
	splitWords = append(splitWords, CapitalizeFirstLetter(currentWord))
	return strings.Join(splitWords, " ")
}

func SafeStringify(value interface{}) string {
	jsonByte, err := json.Marshal(value)
	if err != nil {
		return ""
	}
	return string(jsonByte)
}

const letterBytes = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ"

func RandomString32() string {
	b := make([]byte, 32)
	for i := range b {
		b[i] = letterBytes[rand.Int63()%int64(len(letterBytes))]
	}
	return string(b)
}

func GenerateUuid() string {
	return uuid.New().String()
}

func GenerateUuidV7() (uuid.UUID, error) {
	id, err := uuid.NewV7()
	if err != nil {
		return uuid.Nil, err
	}
	return id, nil
}

func StringToUuid(id string) (uuid.UUID, error) {
	val, err := uuid.Parse(id)
	if err != nil {
		return uuid.Nil, err
	}
	return val, nil
}

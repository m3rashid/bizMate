package utils

import "golang.org/x/exp/constraints"

func Includes[SliceType constraints.Ordered](array []SliceType, element SliceType) bool {
	for _, item := range array {
		if item == element {
			return true
		}
	}
	return false
}

func Conditional[T interface{}](trueVal T, falseVal T, condition bool) T {
	if condition {
		return trueVal
	}
	return falseVal
}

func Ternary[T any](condition bool, trueVal T, falseVal T) T {
	if condition {
		return trueVal
	}
	return falseVal
}

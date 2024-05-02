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

func Conditional(trueVal interface{}, falseVal interface{}, condition bool) interface{} {
	if condition {
		return trueVal
	}
	return falseVal
}

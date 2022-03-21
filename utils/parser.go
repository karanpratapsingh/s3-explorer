package utils

import "strings"

func Trim(value, prefix, suffix string) string {
	return strings.TrimSuffix(strings.TrimPrefix(value, prefix), suffix)
}

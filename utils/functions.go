package utils

func Concat[T any](slices ...[]T) []T {
	result := make([]T, 0)

	for _, slice := range slices {
		result = append(result, slice...)
	}

	return result
}

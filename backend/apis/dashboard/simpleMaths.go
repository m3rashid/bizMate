package dashboard

import (
	"math"
	"sort"
)

func sum(slice *[]float64) float64 {
	var sum float64 = 0
	for _, item := range *slice {
		sum += item
	}
	return sum
}

func count(slice *[]float64) float64 {
	return float64(len(*slice))
}

func max(slice *[]float64) float64 {
	var max float64 = math.MinInt64
	for _, item := range *slice {
		if item > max {
			max = item
		}
	}
	return max
}

func min(slice *[]float64) float64 {
	var min float64 = math.MaxInt64
	for _, item := range *slice {
		if item < min {
			min = item
		}
	}
	return min
}

func average(slice *[]float64) float64 {
	return sum(slice) / count(slice)
}

func median(slice *[]float64) float64 {
	sort.Float64s(*slice)
	if len(*slice)%2 == 0 {
		return ((*slice)[len(*slice)/2-1]) + ((*slice)[len(*slice)/2])/2
	}
	return (*slice)[len(*slice)/2]
}

func mode(slice *[]float64) float64 {
	countMap := make(map[float64]int)
	maxCount := 0
	mode := math.NaN()

	for _, val := range *slice {
		countMap[val]++
		if countMap[val] > maxCount {
			maxCount = countMap[val]
			mode = val
		}
	}

	return mode
}

package dashboard

import (
	"bizMate/models"
	"bizMate/utils"
	"errors"
	"fmt"
	"math"
	"reflect"

	"github.com/gofiber/fiber/v2"
)

type KpiDataResponse struct {
	Kpi  models.DashboardKpi `json:"kpi"`
	Data interface{}         `json:"data"`
}

func getAllKpiData(ctx *fiber.Ctx) error {
	dashboardId := ctx.Params("dashboardId")
	if dashboardId == "" {
		return ctx.SendStatus(fiber.StatusBadRequest)
	}

	db, err := utils.GetDB()
	if err != nil {
		return ctx.SendStatus(fiber.StatusInternalServerError)
	}

	var kpis []models.DashboardKpi
	if err := db.Where("\"dashboardId\" = ?", dashboardId).Find(&kpis).Error; err != nil {
		return ctx.SendStatus(fiber.StatusInternalServerError)
	}

	kpiData := []KpiDataResponse{}
	for _, kpi := range kpis {
		res, err := getSingleKpiData(kpi)
		if err != nil {
			continue // skip invalid kpi
		}
		kpiData = append(kpiData, KpiDataResponse{Kpi: kpi, Data: res})
	}

	return ctx.Status(fiber.StatusOK).JSON(kpiData)
}

type KpiData interface{}

func getSingleKpiData(kpi models.DashboardKpi) (KpiData, error) {
	if !utils.Includes(models.DashboardIndexableModelNames, kpi.Model) {
		return nil, errors.New("invalid model name")
	}

	modelFields := models.DashboardIndexableJsonModels[kpi.Model]
	if _, ok := modelFields[kpi.ModelField]; !ok {
		return nil, errors.New("invalid model field")
	}

	db, err := utils.GetDB()
	if err != nil {
		return nil, err
	}

	var results []interface{}

	query := fmt.Sprintf("select %s from %s where \"createdAt\" >= current_date - interval '%d days';", kpi.ModelField, kpi.Model, kpi.TimePeriod)

	if err := db.Raw(query).Scan(&results).Error; err != nil {
		return nil, err
	}
	fmt.Printf("results: %+v\n", results)
	fmt.Println("types: ", reflect.TypeOf(results), reflect.TypeOf(results[0]))

	if len(results) == 0 {
		return 0, nil
	}

	switch kpi.AggregationType {
	case models.KpiAggregationTypeSum:
		sum := 0
		for _, result := range results {
			val, ok := result.(int)
			if !ok {
				return nil, errors.New("invalid value type")
			}
			sum += val
		}
		return sum, nil

	case models.KpiAggregationTypeCount:
		return len(results), nil

	case models.KpiAggregationTypeMax:
		max := math.MinInt
		for _, result := range results {
			val, ok := result.(int)
			if !ok {
				return nil, errors.New("invalid value type")
			}
			if val > max {
				max = val
			}
		}
		return max, nil

	case models.KpiAggregationTypeMin:
		min := math.MaxInt
		for _, result := range results {
			val, ok := result.(int)
			if !ok {
				return nil, errors.New("invalid value type")
			}
			if val < min {
				min = val
			}
		}
		return min, nil

	case models.KpiAggregationTypeAverage:
		sum := 0
		for _, result := range results {
			val, ok := result.(int)
			if !ok {
				return nil, errors.New("invalid value type")
			}
			sum += val
		}
		return sum / len(results), nil

	case models.KpiAggregationTypeMedian:
		return 0, nil

	case models.KpiAggregationTypeMode:
		return 0, nil

	default:
		return 0, nil
	}
}

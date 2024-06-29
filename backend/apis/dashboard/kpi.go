package dashboard

import (
	"bizMate/models"
	"bizMate/utils"
	"errors"
	"fmt"

	"github.com/gofiber/fiber/v2"
)

type KpiDataResponse struct {
	ID          uint    `json:"id"`
	Title       string  `json:"title"`
	Description string  `json:"description"`
	Data        float64 `json:"data"`
}

func getAllKpiData(ctx *fiber.Ctx) error {
	_, tenantId := utils.GetUserAndTenantIdsOrZero(ctx)
	dashboardId := ctx.Params("dashboardId")
	if dashboardId == "" {
		return ctx.SendStatus(fiber.StatusBadRequest)
	}

	db, err := utils.GetDB()
	if err != nil {
		return ctx.SendStatus(fiber.StatusInternalServerError)
	}

	var kpis []models.DashboardKpi
	if err := db.Where("\"tenantId\" = ? and \"dashboardId\" = ? and deleted = false", tenantId, dashboardId).Find(&kpis).Error; err != nil {
		return ctx.SendStatus(fiber.StatusInternalServerError)
	}

	kpiData := []KpiDataResponse{}
	// TODO make it run in independent go routines for faster response
	for _, kpi := range kpis {
		res, err := getSingleKpiData(kpi, tenantId)
		if err != nil {
			res = 0 // skip invalid kpi
		}
		kpiData = append(kpiData, KpiDataResponse{ID: kpi.ID, Title: kpi.Title, Description: kpi.Description, Data: res})
	}

	return ctx.Status(fiber.StatusOK).JSON(kpiData)
}

func getSingleKpiData(kpi models.DashboardKpi, tenantId uint) (float64, error) {
	if !utils.Includes(models.DashboardIndexableModelNames, kpi.Model) {
		return 0, errors.New("invalid model name")
	}

	modelFields := models.DashboardIndexableJsonModels[kpi.Model]
	if _, ok := modelFields[kpi.ModelField]; !ok {
		return 0, errors.New("invalid model field")
	}

	db, err := utils.GetDB()
	if err != nil {
		return 0, err
	}

	var results []float64
	query := fmt.Sprintf("select \"%s\" from %s where \"tenantId\" = %d and \"createdAt\" >= current_date - interval '%d days';", kpi.ModelField, kpi.Model, tenantId, kpi.TimePeriod)
	if err := db.Raw(query).Scan(&results).Error; err != nil {
		return 0, err
	}

	if len(results) == 0 {
		return 0, nil
	}
	// fmt.Println(query)
	// fmt.Printf("results: %+v\n", results)

	switch kpi.AggregationType {
	case models.KpiAggregationTypeSum:
		return sum(&results), nil

	case models.KpiAggregationTypeCount:
		return count(&results), nil

	case models.KpiAggregationTypeMax:
		return max(&results), nil

	case models.KpiAggregationTypeMin:
		return min(&results), nil

	case models.KpiAggregationTypeAverage:
		return average(&results), nil

	case models.KpiAggregationTypeMedian:
		return median(&results), nil

	case models.KpiAggregationTypeMode:
		return mode(&results), nil

	default:
		return 0, nil
	}
}

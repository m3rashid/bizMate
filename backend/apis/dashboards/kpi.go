package dashboards

import (
	"bizMate/models"
	"bizMate/utils"
	"errors"
	"fmt"

	"github.com/gofiber/fiber/v2"
)

type KpiDataResponse struct {
	ID          string  `json:"id"`
	Title       string  `json:"title"`
	Description string  `json:"description"`
	Data        float64 `json:"data"`
}

func getAllKpiData(ctx *fiber.Ctx) error {
	// _, workspaceId := utils.GetUserAndWorkspaceIdsOrZero(ctx)
	dashboardId := ctx.Params("dashboardId")
	if dashboardId == "" {
		return fiber.NewError(fiber.StatusBadRequest, "Invalid dashboard ID")
	}

	// db, err := utils.GetPostgresDB()
	// if err != nil {
	// 	return fiber.NewError(fiber.StatusInternalServerError)
	// }

	// var kpis []models.DashboardKpi
	// if err := db.Where("\"workspaceId\" = ? and \"dashboardId\" = ? and deleted = false", workspaceId, dashboardId).Find(&kpis).Error; err != nil {
	// 	return fiber.NewError(fiber.StatusInternalServerError)
	// }

	// kpiData := []KpiDataResponse{}
	// // TODO make it run in independent go routines for faster response
	// for _, kpi := range kpis {
	// 	res, err := getSingleKpiData(kpi, workspaceId.String())
	// 	if err != nil {
	// 		res = 0 // skip invalid kpi
	// 	}
	// 	kpiData = append(kpiData, KpiDataResponse{ID: kpi.ID, Title: kpi.Title, Description: kpi.Description, Data: res})
	// }

	return ctx.Status(fiber.StatusOK).JSON(utils.SendResponse(nil, "KPI data fetched successfully"))
}

func getSingleKpiData(kpi models.DashboardKpi, workspaceId string) (float64, error) {
	if !utils.Includes(models.DashboardIndexableModelNames, kpi.Model) {
		return 0, errors.New("invalid model name")
	}

	modelFields := models.DashboardIndexableJsonModels[kpi.Model]
	if _, ok := modelFields[kpi.ModelField]; !ok {
		return 0, errors.New("invalid model field")
	}

	// db, err := utils.GetPostgresDB()
	// if err != nil {
	// 	return 0, err
	// }

	queryBuilder := func(condition string) string {
		return fmt.Sprintf("select %s from %s where \"workspaceId\" = '%s' and \"createdAt\" >= current_date - interval '%d days';", condition, kpi.Model, workspaceId, kpi.TimePeriod)
	}

	var query string
	if kpi.AggregationType == models.KpiAggregationTypeSum {
		query = queryBuilder("sum(\"" + kpi.ModelField + "\")")
	} else if kpi.AggregationType == models.KpiAggregationTypeCount {
		query = queryBuilder("count(\"" + kpi.ModelField + "\")")
	} else if kpi.AggregationType == models.KpiAggregationTypeMax {
		query = queryBuilder("max(\"" + kpi.ModelField + "\")")
	} else if kpi.AggregationType == models.KpiAggregationTypeMin {
		query = queryBuilder("min(\"" + kpi.ModelField + "\")")
	} else if kpi.AggregationType == models.KpiAggregationTypeAverage {
		query = queryBuilder("avg(\"" + kpi.ModelField + "\")")
	} else if kpi.AggregationType == models.KpiAggregationTypeMedian {
		query = queryBuilder("percentile_cont(0.5) within group (order by \"" + kpi.ModelField + "\")")
	} else if kpi.AggregationType == models.KpiAggregationTypeMode {
		query = queryBuilder("mode() within group (order by \"" + kpi.ModelField + "\")")
	}

	if query == "" {
		return 0, nil
	}

	return 0, nil
	// var result float64
	// if err := db.Raw(query).Scan(&result).Error; err != nil {
	// 	return 0, err
	// }
	// return result, nil
}

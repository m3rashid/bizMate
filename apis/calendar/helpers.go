package calendar

import (
	"strconv"
	"time"

	"github.com/google/uuid"
	"github.com/jackc/pgx/v5/pgtype"
)

const create_event = "create_event"

type createCalendarEventReqBody struct {
	Name        string `json:"name"`
	Description string `json:"description"`
	StartTime   string `json:"start_time"`
	EndTime     string `json:"end_time"`
	IsPrivate   *bool  `json:"is_private"`
	// something for the recurrence rule
}

func getDayStartAndEnd(year int, month int, day int) (pgtype.Timestamptz, pgtype.Timestamptz) {
	start := time.Date(year, time.Month(month), day, 0, 0, 0, 0, time.UTC)
	end := start.AddDate(0, 0, 1).Add(-time.Nanosecond)

	startTime := pgtype.Timestamptz{Time: start, Valid: true}
	endTime := pgtype.Timestamptz{Time: end, Valid: true}

	return startTime, endTime
}

func getMonthStartAndEnd(year int, month int) (pgtype.Timestamptz, pgtype.Timestamptz) {
	start := time.Date(year, time.Month(month), 1, 0, 0, 0, 0, time.UTC)
	end := start.AddDate(0, 1, 0).Add(-time.Nanosecond)

	startTime := pgtype.Timestamptz{Time: start, Valid: true}
	endTime := pgtype.Timestamptz{Time: end, Valid: true}

	return startTime, endTime
}

func getWeekStartAndEnd(year int, week int) (pgtype.Timestamptz, pgtype.Timestamptz) {
	start := time.Date(year, 1, 1, 0, 0, 0, 0, time.UTC)
	start = start.AddDate(0, 0, (week-1)*7-int(start.Weekday()))
	end := start.AddDate(0, 0, 7).Add(-time.Nanosecond)

	startTime := pgtype.Timestamptz{Time: start, Valid: true}
	endTime := pgtype.Timestamptz{Time: end, Valid: true}

	return startTime, endTime
}

func monthOrYearStringToNumber(monthOrYear string, defaultVal int) (int, error) {
	if monthOrYear == "" {
		return defaultVal, nil
	}

	monthOrYearNumber, err := strconv.Atoi(monthOrYear)
	if err != nil {
		return 0, err
	}
	return monthOrYearNumber, nil
}

func requestedUserIdToUuid(requestUserId string, currentUserId uuid.UUID) (uuid.UUID, error) {
	if requestUserId == "" {
		return currentUserId, nil
	}

	requestedUserId, err := uuid.Parse(requestUserId)
	if err != nil || requestedUserId == uuid.Nil {
		return uuid.Nil, err
	}

	return requestedUserId, nil
}

package calendar

import (
	"bizMate/repository"
	"bizMate/utils"
	"time"

	"github.com/gofiber/fiber/v2"
	"github.com/google/uuid"
)

func getCalendarEventsByMonth(ctx *fiber.Ctx) error {
	userId, workspaceId := utils.GetUserAndWorkspaceIdsOrZero(ctx)
	if userId == uuid.Nil || workspaceId == uuid.Nil {
		return fiber.NewError(fiber.StatusBadRequest, "User or Workspace not present")
	}

	_monthNumber := ctx.Query("month", "")
	_yearNumber := ctx.Query("year", "")
	_requestedUserId := ctx.Query("user_id", "")

	requestedUserId, err := requestedUserIdToUuid(_requestedUserId, userId)
	if err != nil {
		return fiber.NewError(fiber.StatusBadRequest, "Invalid user id")
	}

	monthNumber, err := monthOrYearStringToNumber(_monthNumber, int(time.Now().Month()))
	if err != nil {
		return fiber.NewError(fiber.StatusBadRequest, "Invalid month number")
	}

	yearNumber, err := monthOrYearStringToNumber(_yearNumber, time.Now().Year())
	if err != nil {
		return fiber.NewError(fiber.StatusBadRequest, "Invalid year number")
	}

	startTime, endTime := getMonthStartAndEnd(yearNumber, monthNumber)
	isPrivate := requestedUserId == userId

	pgConn, err := utils.GetPostgresDB()
	if err != nil {
		return fiber.NewError(fiber.StatusInternalServerError)
	}

	queries := repository.New(pgConn)

	events, err := queries.GetCalendarEventsInRangeByWorkspace(ctx.Context(), repository.GetCalendarEventsInRangeByWorkspaceParams{
		IsPrivate:   isPrivate,
		WorkspaceID: workspaceId,
		UserID:      requestedUserId,
		StartTime:   startTime,
		EndTime:     endTime,
	})
	if err != nil {
		return fiber.NewError(fiber.StatusInternalServerError)
	}

	return ctx.Status(fiber.StatusOK).JSON(
		utils.SendResponse(events, "Calendar events fetched successfully"),
	)
}

func getCalendarEventsByWeek(ctx *fiber.Ctx) error {
	userId, workspaceId := utils.GetUserAndWorkspaceIdsOrZero(ctx)
	if userId == uuid.Nil || workspaceId == uuid.Nil {
		return fiber.NewError(fiber.StatusBadRequest, "User or Workspace not present")
	}

	_yearNumber := ctx.Query("year", "")
	_weekNumber := ctx.Query("week", "")
	_requestedUserId := ctx.Query("user_id", "")

	requestedUserId, err := requestedUserIdToUuid(_requestedUserId, userId)
	if err != nil {
		return fiber.NewError(fiber.StatusBadRequest, "Invalid user id")
	}

	yearNumber, err := monthOrYearStringToNumber(_yearNumber, time.Now().Year())
	if err != nil {
		return fiber.NewError(fiber.StatusBadRequest, "Invalid year number")
	}

	weekNumber, err := monthOrYearStringToNumber(_weekNumber, int(time.Now().Weekday()))
	if err != nil {
		return fiber.NewError(fiber.StatusBadRequest, "Invalid week number")
	}

	startTime, endTime := getWeekStartAndEnd(yearNumber, weekNumber)
	isPrivate := requestedUserId == userId

	pgConn, err := utils.GetPostgresDB()
	if err != nil {
		return fiber.NewError(fiber.StatusInternalServerError)
	}

	queries := repository.New(pgConn)
	events, err := queries.GetCalendarEventsInRangeByWorkspace(ctx.Context(), repository.GetCalendarEventsInRangeByWorkspaceParams{
		IsPrivate:   isPrivate,
		WorkspaceID: workspaceId,
		UserID:      requestedUserId,
		StartTime:   startTime,
		EndTime:     endTime,
	})
	if err != nil {
		return fiber.NewError(fiber.StatusInternalServerError)
	}

	return ctx.Status(fiber.StatusOK).JSON(
		utils.SendResponse(events, "Calendar events fetched successfully"),
	)
}

func getCalendarEventsByDay(ctx *fiber.Ctx) error {
	userId, workspaceId := utils.GetUserAndWorkspaceIdsOrZero(ctx)
	if userId == uuid.Nil || workspaceId == uuid.Nil {
		return fiber.NewError(fiber.StatusBadRequest, "User or Workspace not present")
	}

	_yearNumber := ctx.Query("year", "")
	_monthNumber := ctx.Query("month", "")
	_dayNumber := ctx.Query("day", "")
	_requestedUserId := ctx.Query("user_id", "")

	requestedUserId, err := requestedUserIdToUuid(_requestedUserId, userId)
	if err != nil {
		return fiber.NewError(fiber.StatusBadRequest, "Invalid user id")
	}

	yearNumber, err := monthOrYearStringToNumber(_yearNumber, time.Now().Year())
	if err != nil {
		return fiber.NewError(fiber.StatusBadRequest, "Invalid year number")
	}

	monthNumber, err := monthOrYearStringToNumber(_monthNumber, int(time.Now().Month()))
	if err != nil {
		return fiber.NewError(fiber.StatusBadRequest, "Invalid month number")
	}

	dayNumber, err := monthOrYearStringToNumber(_dayNumber, time.Now().Day())
	if err != nil {
		return fiber.NewError(fiber.StatusBadRequest, "Invalid day number")
	}

	startTime, endTime := getDayStartAndEnd(yearNumber, monthNumber, dayNumber)
	isPrivate := requestedUserId == userId

	pgConn, err := utils.GetPostgresDB()
	if err != nil {
		return fiber.NewError(fiber.StatusInternalServerError)
	}

	queries := repository.New(pgConn)
	events, err := queries.GetCalendarEventsInRangeByWorkspace(ctx.Context(), repository.GetCalendarEventsInRangeByWorkspaceParams{
		IsPrivate:   isPrivate,
		WorkspaceID: workspaceId,
		UserID:      requestedUserId,
		StartTime:   startTime,
		EndTime:     endTime,
	})
	if err != nil {
		return fiber.NewError(fiber.StatusInternalServerError)
	}

	return ctx.Status(fiber.StatusOK).JSON(
		utils.SendResponse(events, "Calendar events fetched successfully"),
	)
}

func getSingleCalendarEventById(ctx *fiber.Ctx) error {
	userId, workspaceId := utils.GetUserAndWorkspaceIdsOrZero(ctx)
	if userId == uuid.Nil || workspaceId == uuid.Nil {
		return fiber.NewError(fiber.StatusBadRequest, "User or Workspace not present")
	}

	eventId := ctx.Params("eventId")
	if eventId == "" {
		return fiber.NewError(fiber.StatusBadRequest, "Event id not present")
	}

	eventIdUuid, err := uuid.Parse(eventId)
	if err != nil || eventIdUuid == uuid.Nil {
		return fiber.NewError(fiber.StatusBadRequest, "Invalid event id")
	}

	pgConn, err := utils.GetPostgresDB()
	if err != nil {
		return fiber.NewError(fiber.StatusInternalServerError)
	}

	queries := repository.New(pgConn)
	event, err := queries.GetCalendarEventById(ctx.Context(), eventIdUuid)
	if err != nil {
		return fiber.NewError(fiber.StatusInternalServerError)
	}

	return ctx.Status(fiber.StatusOK).JSON(
		utils.SendResponse(event, "Calendar event fetched successfully"),
	)
}

func createCalendarEvent(ctx *fiber.Ctx) error {
	userEmail := utils.GetUserEmailFromCtx(ctx)
	userId, workspaceId := utils.GetUserAndWorkspaceIdsOrZero(ctx)
	if userId == uuid.Nil || workspaceId == uuid.Nil {
		return fiber.NewError(fiber.StatusBadRequest, "User or Workspace not present")
	}

	reqBody := createCalendarEventReqBody{}
	if err := utils.ParseBodyAndValidate(ctx, &reqBody); err != nil {
		go utils.LogError(
			create_event,
			userEmail,
			workspaceId,
			repository.CalendarEventObjectType,
			repository.LogData{
				"error": err.Error(),
			},
		)
		return fiber.NewError(fiber.StatusBadRequest, err.Error())
	}

	id, err := utils.GenerateUuidV7()
	if err != nil {
		return fiber.NewError(fiber.StatusInternalServerError, err.Error())
	}

	pgConn, err := utils.GetPostgresDB()
	if err != nil {
		return fiber.NewError(fiber.StatusInternalServerError, err.Error())
	}

	queries := repository.New(pgConn)
	if err := queries.CreateCalendarEvent(ctx.Context(), repository.CreateCalendarEventParams{}); err != nil {
		go utils.LogError(
			create_event,
			userEmail,
			workspaceId,
			repository.CalendarEventObjectType,
			repository.LogData{
				"error": err.Error(),
			},
		)
		return fiber.NewError(fiber.StatusInternalServerError, err.Error())
	}

	go utils.LogInfo(
		create_event,
		userEmail,
		workspaceId,
		repository.CalendarEventObjectType,
		repository.LogData{
			"id":   id.String(),
			"name": reqBody.Name,
		},
	)
	return ctx.Status(fiber.StatusOK).JSON(utils.SendResponse(id, "Calendar event created successfully"))
}

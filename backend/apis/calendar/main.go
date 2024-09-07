package calendar

import (
	"bizMate/utils"

	"github.com/gofiber/fiber/v2"
)

func Setup(initialRoute string, app *fiber.App) {
	app.Get(initialRoute+"/month", utils.CheckAuthMiddlewareWithWorkspace, getCalendarEventsByMonth)

	app.Get(initialRoute+"/week", utils.CheckAuthMiddlewareWithWorkspace, getCalendarEventsByWeek)

	app.Get(initialRoute+"/day", utils.CheckAuthMiddlewareWithWorkspace, getCalendarEventsByDay)

	app.Get(initialRoute+"/single/:eventId", utils.CheckAuthMiddlewareWithWorkspace, getSingleCalendarEventById)

	app.Post(initialRoute+"/create", utils.CheckAuthMiddlewareWithWorkspace, createCalendarEvent)
}

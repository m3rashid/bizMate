package models

const TAG_MODEL_NAME string = "project_tags"
const TASK_MODEL_NAME string = "project_tasks"
const PROJECT_MODEL_NAME string = "projects"
const PROJECT_CYCLE_MODEL_NAME = "project_cycles"
const PROJECT_TASK_EVENT_MODEL_NAME = "project_task_comments"

var ProjectCycleJsonModel = DashboardIndexableJsonModel{
	ModelName: PROJECT_CYCLE_MODEL_NAME,
	Fields: map[string]JsonFieldType{
		"id":             JsonString,
		"startDay":       JsonDate,
		"createdAt":      JsonDate,
		"createdBy":      JsonCreatedBy,
		"projectId":      JsonString,
		"cycleGoals":     JsonString,
		"cycleDaysCount": JsonNumber,
	},
}

var ProjectJsonModel = DashboardIndexableJsonModel{
	ModelName: PROJECT_MODEL_NAME,
	Fields: map[string]JsonFieldType{
		"id":          JsonString,
		"name":        JsonString,
		"abandoned":   JsonBool,
		"completed":   JsonBool,
		"createdAt":   JsonDate,
		"createdBy":   JsonCreatedBy,
		"description": JsonString,
	},
}

var ProjectTagJsonModel = DashboardIndexableJsonModel{
	ModelName: TAG_MODEL_NAME,
	Fields: map[string]JsonFieldType{
		"id":        JsonString,
		"name":      JsonString,
		"createdAt": JsonDate,
	},
}

var ProjectTaskJsonModel = DashboardIndexableJsonModel{
	ModelName: TASK_MODEL_NAME,
	Fields: map[string]JsonFieldType{
		"id":           JsonString,
		"title":        JsonString,
		"status":       JsonString,
		"deadline":     JsonDate,
		"createdAt":    JsonDate,
		"createdBy":    JsonCreatedBy,
		"projectId":    JsonString,
		"description":  JsonString,
		"parentTaskId": JsonString,
	},
}

type ProjectTaskEventType string

const (
	ProjectTaskEventAddComment     ProjectTaskEventType = "add_comment"
	ProjectTaskEventEditComment    ProjectTaskEventType = "edit_comment"
	ProjectTaskEventDeleteComment  ProjectTaskEventType = "delete_comment"
	ProjectTaskEventStatusChange   ProjectTaskEventType = "status_change"
	ProjectTaskEventAddAssignee    ProjectTaskEventType = "add_assignee"
	ProjectTaskEventRemoveAssignee ProjectTaskEventType = "remove_assignee"
	ProjectTaskEventAddTag         ProjectTaskEventType = "add_tag"
	ProjectTaskEventRemoveTag      ProjectTaskEventType = "remove_tag"
)

var ProjectTaskEventJsonModel = DashboardIndexableJsonModel{
	ModelName: PROJECT_TASK_EVENT_MODEL_NAME,
	Fields: map[string]JsonFieldType{
		"id":        JsonString,
		"type":      JsonString,
		"data":      JsonString,
		"taskId":    JsonString,
		"createdAt": JsonDate,
		"createdBy": JsonCreatedBy,
	},
}

package models

const USER_MODEL_NAME string = "users"
const USER_INVITE_MODEL_NAME string = "user_invites"

var UserJsonModel = DashboardIndexableJsonModel{
	ModelName: USER_MODEL_NAME,
	Fields: map[string]JsonFieldType{
		"id":          JsonString,
		"name":        JsonString,
		"email":       JsonString,
		"phone":       JsonString,
		"createdAt":   JsonDate,
		"deactivated": JsonBool,
	},
}

var UserInviteJsonModel = DashboardIndexableJsonModel{
	ModelName: USER_INVITE_MODEL_NAME,
	Fields: map[string]JsonFieldType{
		"id":        JsonString,
		"name":      JsonString,
		"email":     JsonString,
		"createdAt": JsonDate,
		"status":    JsonNumber,
	},
}

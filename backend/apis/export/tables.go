package export

import (
	"bizMate/repository"
)

// type model

var exportableTables = map[string]struct {
	name   string
	schema map[string]repository.JsonFieldType
}{
	"form_response_table": {name: repository.FORM_RESPONSES_MODEL_NAME},
	"user_table":          {name: repository.USERS_MODEL_NAME, schema: repository.UserJsonModel.Fields},
	"forms_table":         {name: repository.FORMS_MODEL_NAME, schema: repository.FormJsonModel.Fields},
}

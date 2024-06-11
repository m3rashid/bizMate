package export

import (
	"bizmate/models"
)

// type model

var exportableTables = map[string]struct {
	name   string
	schema map[string]models.JsonFieldType
}{
	"form_response_table": {name: models.FORM_RESPONSE_MODEL_NAME},
	"user_table":          {name: models.USER_MODEL_NAME, schema: models.UserJsonModel.Fields},
	"forms_table":         {name: models.FORM_MODEL_NAME, schema: models.FormJsonModel.Fields},
}

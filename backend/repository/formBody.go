package repository

import (
	"time"

	"github.com/google/uuid"
	"go.mongodb.org/mongo-driver/bson"
)

type FormElementName string

const (
	Input             FormElementName = "input"
	TextareaInput     FormElementName = "textareaInput"
	PhoneNumberInput  FormElementName = "phoneNumberInput"
	RichTextInput     FormElementName = "richTextInput"
	Paragraph         FormElementName = "paragraph"
	Image             FormElementName = "image"
	Link              FormElementName = "link"
	Heading           FormElementName = "heading"
	Code              FormElementName = "code"
	TogglerInput      FormElementName = "togglerInput"
	SingleSelectInput FormElementName = "singleSelectInput"
	RadioInput        FormElementName = "radioInput"
)

type FormElementInstance struct {
	ID    string                 `json:"id" bson:"id"`
	Name  FormElementName        `json:"name" bson:"name"`
	Props map[string]interface{} `json:"props" bson:"props"`
}

type FormBody struct {
	FormID      uuid.UUID             `json:"form_id" bson:"form_id"`
	CreatedAt   time.Time             `json:"created_at" bson:"created_at"`
	WorkspaceID uuid.UUID             `json:"workspace_id" bson:"workspace_id"`
	CreatedByID uuid.UUID             `json:"created_by_id" bson:"created_by_id"`
	Body        []FormElementInstance `json:"body" bson:"body"`
}

func (formBody *FormBody) MarshalBSON() ([]byte, error) {
	if formBody.CreatedAt.IsZero() {
		formBody.CreatedAt = time.Now()
	}
	type fb FormBody
	return bson.Marshal((*fb)(formBody))
}

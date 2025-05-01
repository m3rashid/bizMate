package forms

import (
	"bizMate/repository"

	"github.com/google/uuid"
)

const create_form = "create_form"
const update_form = "update_form"
const delete_form = "delete_form"
const update_form_body = "update_form_body"
const create_form_response = "create_form_response"

type CreateFormReqBody struct {
	Title                   string `json:"title" validate:"required,min=5,max=50"`
	Description             string `json:"description" validate:"max=50"`
	Active                  *bool  `json:"active"`
	SendResponseEmail       *bool  `json:"send_response_email"`
	AllowAnonymousResponses *bool  `json:"allow_anonymous_responses"`
	SubmitText              string `json:"submit_text" validate:"min=5,max=50"`
	CancelText              string `json:"cancel_text" validate:"min=5,max=50"`
	AllowMultipleResponses  *bool  `json:"allow_multiple_responses"`
}

type FormAnalysisResponse struct {
	Title       string     `json:"title"`
	Description string     `json:"description"`
	Analysis    []Analysis `json:"analysis"`
}

type UpdateFormReqBody struct {
	CreateFormReqBody
	ID uuid.UUID `json:"id" validate:"required"`
}

type formResponseReqBody struct {
	Responses map[string]interface{} `json:"response" validate:"required"`
}

type FormBodyReqBody struct {
	FormBody repository.FormBody `json:"form_body" validate:"required"`
}

type AnalysisFieldType = string

const (
	booleanField      AnalysisFieldType = "boolean"
	singleSelectField AnalysisFieldType = "singleSelect"
	multiSelectField  AnalysisFieldType = "multiSelect"
)

type Field struct {
	Name  string            `json:"name"`
	Label string            `json:"label"`
	Type  AnalysisFieldType `json:"-"`
}

type Analysis struct {
	Field
	Counts map[string]int `json:"counts"`
}

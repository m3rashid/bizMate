package forms

import (
	"bizMate/repository"

	"github.com/google/uuid"
)

const create_form_success = "create_form_success"
const create_form_fail = "create_form_fail"
const create_form_bad_request = "create_form_bad_request"
const form_not_found_by_id = "form_not_found_by_id"

const update_form_body_success = "update_form_body_success"
const update_form_body_fail = "update_form_body_fail"
const update_form_body_bad_request = "update_form_body_bad_request"

const paginate_forms_fail = "paginate_forms_fail"
const paginate_forms_success = "paginate_forms_success"

const update_form_bad_request = "update_form_bad_request"
const update_form_fail = "update_form_fail"
const update_form_success = "update_form_success"

const delete_form_fail = "delete_form_fail"
const delete_form_success = "delete_form_success"

const create_form_response_fail = "create_form_response_fail"
const create_form_response_success = "create_form_response_success"
const create_form_response_bad_request = "create_form_response_bad_request"

const count_form_responses_fail = "count_form_responses_fail"
const paginate_form_responses_fail = "paginate_form_responses_fail"
const paginate_form_responses_success = "paginate_form_responses_success"

const get_form_analysis_fail = "get_form_analysis_fail"
const get_form_analysis_success = "get_form_analysis_success"

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

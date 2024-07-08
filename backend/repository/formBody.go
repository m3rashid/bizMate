package repository

import (
	"bizMate/utils"
	"encoding/json"
	"errors"
	"fmt"
	"reflect"
	"time"

	"github.com/google/uuid"
	"go.mongodb.org/mongo-driver/bson"
)

const FORM_BODY_COLLECTION_NAME = "forms_body"

const (
	formString      string = "string"
	formTextarea    string = "textArea"
	formNumber      string = "number"
	formBoolean     bool   = false
	formStringArray string = "options"
)

type Props map[string]interface{}

var phoneNumberInputProps = Props{
	"name":            formString,
	"label":           formString,
	"required":        formBoolean,
	"labelClassName":  formString,
	"descriptionText": formString,
}

var inputProps = Props{
	"name":            formString,
	"label":           formString,
	"required":        formBoolean,
	"labelClassName":  formString,
	"descriptionText": formString,
}

var textareaInputProps = Props{
	"name":            formString,
	"label":           formString,
	"required":        formBoolean,
	"labelClassName":  formString,
	"descriptionText": formString,
}

var paragraphProps = Props{
	"text":      formString,
	"className": formString,
}

var imageProps = Props{
	"src":       formString,
	"className": formString,
}

var linkProps = Props{
	"href":      formString,
	"text":      formString,
	"className": formString,
	"target":    formString,
}

var headingProps = Props{
	"text":      formString,
	"className": formString,
}

var codeProps = Props{
	"code":      formString,
	"className": formString,
}

var togglerInputProps = Props{
	"name":            formString,
	"label":           formString,
	"required":        formBoolean,
	"className":       formString,
	"descriptionText": formString,
}

var richTextInputProps = Props{
	"name":            formString,
	"label":           formString,
	"required":        formBoolean,
	"labelClassName":  formString,
	"descriptionText": formString,
}

var singleSelectInputProps = Props{
	"name":            formString,
	"label":           formString,
	"shuffle":         formBoolean,
	"required":        formBoolean,
	"descriptionText": formString,
	"options":         formStringArray,
}

var radioInputProps = Props{
	"name":            formString,
	"label":           formString,
	"shuffle":         formBoolean,
	"required":        formBoolean,
	"descriptionText": formString,
	"options":         formStringArray,
}

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

var ElementPropsMap = map[FormElementName]Props{
	Input:             inputProps,
	TextareaInput:     textareaInputProps,
	PhoneNumberInput:  phoneNumberInputProps,
	RichTextInput:     richTextInputProps,
	Paragraph:         paragraphProps,
	Image:             imageProps,
	Link:              linkProps,
	Heading:           headingProps,
	Code:              codeProps,
	TogglerInput:      togglerInputProps,
	SingleSelectInput: singleSelectInputProps,
	RadioInput:        radioInputProps,
}

type FormElementInstanceType struct {
	ID       string                    `json:"id" bson:"id"`
	Name     FormElementName           `json:"name" bson:"name"`
	Props    map[string]interface{}    `json:"props" bson:"props"`
	Children []FormElementInstanceType `json:"children"`
}

var inputElements = []FormElementName{
	Input, TextareaInput, PhoneNumberInput, RichTextInput, TogglerInput, SingleSelectInput, RadioInput,
}

func (elName FormElementName) IsFormInputElement() bool {
	for _, item := range inputElements {
		if item == elName {
			return true
		}
	}

	return false
}

func (elName FormElementName) GetSupportedProps() Props {
	val, ok := ElementPropsMap[elName]
	if !ok {
		return Props{}
	}
	return val
}

func validateFormElementInstance(el FormElementInstanceType) []string {
	errorArr := []string{}
	elementProps := el.Props
	supportedProps := el.Name.GetSupportedProps()

	if _, ok := el.Props["name"]; el.Name.IsFormInputElement() && !ok {
		errorArr = append(errorArr, "name attribute not present in "+el.ID+"_"+string(el.Name))
	}

	if len(el.Children) > 0 {
		for _, formElement := range el.Children {
			errorArr = append(errorArr, validateFormElementInstance(formElement)...)
		}
	}

	for propName, propValueType := range supportedProps {
		if _, ok := elementProps[propName]; !ok {
			fmt.Println(propName + " not present")
			continue
		}

		if (propValueType == formString || propValueType == formTextarea) && reflect.TypeOf(elementProps[propName]) != reflect.TypeOf("") {
			errorArr = append(errorArr, "invalid data type for "+propName)
		} else if propValueType == formNumber && reflect.TypeOf(elementProps[propName]) != reflect.TypeOf(1) {
			errorArr = append(errorArr, "invalid data type for "+propName)
		} else if propValueType == formBoolean && reflect.TypeOf(elementProps[propName]) != reflect.TypeOf(true) {
			errorArr = append(errorArr, "invalid data type for "+propName)
			// } else if propValueType == _FORM_CHILDREN {
			// this will be formElement instance
		} else if propValueType == formStringArray && reflect.TypeOf(elementProps[propName]) != reflect.TypeOf([]string{}) {
			errorArr = append(errorArr, "invalid data type for "+propName)
		}
	}

	return errorArr
}

func ValidateFormJsonString(jsonStr string) error {
	jsonArr := []FormElementInstanceType{}
	errorArr := []string{}

	err := json.Unmarshal([]byte(jsonStr), &jsonArr)
	if err != nil {
		fmt.Println("Error in unmarshal json", err)
		return err
	}

	for _, elementInstance := range jsonArr {
		errorArr = append(errorArr, validateFormElementInstance(elementInstance)...)
	}

	fmt.Println("errors", errorArr)

	return utils.Ternary(len(errorArr) == 0, nil, errors.New(fmt.Sprint(len(errorArr))+" errors occured"))
}

type FormBody struct {
	FormID      uuid.UUID                 `json:"form_id" bson:"form_id"`
	CreatedAt   time.Time                 `json:"created_at" bson:"created_at"`
	WorkspaceID uuid.UUID                 `json:"workspace_id" bson:"workspace_id"`
	CreatedByID uuid.UUID                 `json:"created_by_id" bson:"created_by_id"`
	Body        []FormElementInstanceType `json:"body" bson:"body"`
}

func (formBody *FormBody) MarshalBSON() ([]byte, error) {
	if formBody.CreatedAt.IsZero() {
		formBody.CreatedAt = time.Now()
	}
	type fb FormBody
	return bson.Marshal((*fb)(formBody))
}

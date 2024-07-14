package repository

import (
	"fmt"
	"reflect"
)

const FORM_BODY_COLLECTION_NAME = "forms_body"

const (
	formBoolean     bool   = false
	formString      string = "string"
	formNumber      string = "number"
	formStringArray string = "options"
	formTextarea    string = "textArea"
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

func (el FormElementInstanceType) validateFormElementInstance() []string {
	errorArr := []string{}
	elementProps := el.Props
	supportedProps := el.Name.GetSupportedProps()

	if _, ok := el.Props["name"]; el.Name.IsFormInputElement() && !ok {
		errorArr = append(errorArr, "name attribute not present in "+el.ID+"_"+string(el.Name))
	}

	if len(el.Children) > 0 {
		for _, formElement := range el.Children {
			errorArr = append(errorArr, formElement.validateFormElementInstance()...)
		}
	}

	for propName, propValueType := range supportedProps {
		if _, ok := elementProps[propName]; !ok {
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
		} else if propValueType == formStringArray && reflect.TypeOf(elementProps[propName]) != reflect.TypeOf([]interface{}{}) {
			fmt.Println(propValueType, reflect.TypeOf(elementProps[propName]))
			errorArr = append(errorArr, "invalid data type for "+propName)
		}
	}

	return errorArr
}

func ValidateFormBodyMeta(els []FormElementInstanceType) [][]string {
	validationErrors := [][]string{}
	for _, elementInstance := range els {
		validErr := elementInstance.validateFormElementInstance()
		if len(validErr) > 0 {
			validationErrors = append(validationErrors, validErr)
		}
	}
	return validationErrors
}

type FormBodyMeta struct {
	Meta         []FormElementInstanceType `json:"meta"`
	NextText     string                    `json:"next_text"`
	PreviousText string                    `json:"previous_text"`
}

type FormBody []FormBodyMeta

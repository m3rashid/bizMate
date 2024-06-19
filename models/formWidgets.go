package models

type ElementNameType string

const (
	FORM_STRING   string = "string"
	FORM_TEXTAREA string = "textArea"
	FORM_NUMBER   string = "number"
	// FORM_BOOLEAN      string = "boolean"
	FORM_BOOLEAN      bool   = false
	FORM_STRING_ARRAY string = "options"
	// _FORM_CHILDREN     supportedFormType = "children"
)

type Props map[string]interface{}

type FormElementInstanceType struct {
	ID       string                    `json:"id"`
	Name     ElementNameType           `json:"name"`
	Props    Props                     `json:"props"`
	Children []FormElementInstanceType `json:"children"`
}

var ButtonProps = Props{
	"label":     FORM_STRING,
	"className": FORM_STRING,
	"type":      FORM_STRING,
	"size":      FORM_STRING,
	"variant":   FORM_STRING,
}

var PhoneNumberInputProps = Props{
	"name":            FORM_STRING,
	"label":           FORM_STRING,
	"required":        FORM_BOOLEAN,
	"labelClassName":  FORM_STRING,
	"descriptionText": FORM_STRING,
}

var TextInputProps = Props{
	"name":            FORM_STRING,
	"label":           FORM_STRING,
	"required":        FORM_BOOLEAN,
	"labelClassName":  FORM_STRING,
	"descriptionText": FORM_STRING,
}

var TextareaInputProps = Props{
	"name":            FORM_STRING,
	"label":           FORM_STRING,
	"required":        FORM_BOOLEAN,
	"labelClassName":  FORM_STRING,
	"descriptionText": FORM_STRING,
}

var ParagraphProps = Props{
	"text":      FORM_STRING,
	"className": FORM_STRING,
}

var ColumnProps = Props{
	"className": FORM_STRING,
}

var ImageProps = Props{
	"src":       FORM_STRING,
	"className": FORM_STRING,
}

var LinkProps = Props{
	"href":      FORM_STRING,
	"text":      FORM_STRING,
	"className": FORM_STRING,
	"target":    FORM_STRING,
}

var HeadingProps = Props{
	"text":      FORM_STRING,
	"className": FORM_STRING,
}

var CodeProps = Props{
	"code":      FORM_STRING,
	"className": FORM_STRING,
}

var TogglerInputProps = Props{
	"name":            FORM_STRING,
	"label":           FORM_STRING,
	"required":        FORM_BOOLEAN,
	"className":       FORM_STRING,
	"descriptionText": FORM_STRING,
}

var RichTextInputProps = Props{
	"name":            FORM_STRING,
	"label":           FORM_STRING,
	"required":        FORM_BOOLEAN,
	"labelClassName":  FORM_STRING,
	"descriptionText": FORM_STRING,
}

var SingleSelectInputProps = Props{
	"name":            FORM_STRING,
	"label":           FORM_STRING,
	"shuffle":         FORM_BOOLEAN,
	"required":        FORM_BOOLEAN,
	"descriptionText": FORM_STRING,
	"options":         FORM_STRING_ARRAY,
}

var RadioInputProps = Props{
	"name":            FORM_STRING,
	"label":           FORM_STRING,
	"shuffle":         FORM_BOOLEAN,
	"required":        FORM_BOOLEAN,
	"descriptionText": FORM_STRING,
	"options":         FORM_STRING_ARRAY,
}

const (
	Input             ElementNameType = "input"
	TextareaInput     ElementNameType = "textareaInput"
	PhoneNumberInput  ElementNameType = "phoneNumberInput"
	RichTextInput     ElementNameType = "richTextInput" //
	Paragraph         ElementNameType = "paragraph"
	Image             ElementNameType = "image"
	Link              ElementNameType = "link"
	H1                ElementNameType = "h1"
	H2                ElementNameType = "h2"
	H3                ElementNameType = "h3"
	H4                ElementNameType = "h4"
	H5                ElementNameType = "h5"
	H6                ElementNameType = "h6"
	Code              ElementNameType = "code"
	TogglerInput      ElementNameType = "togglerInput"
	SingleSelectInput ElementNameType = "singleSelectInput"
	RadioInput        ElementNameType = "radioInput"
)

var ElementPropsMap = map[ElementNameType]Props{
	Input:             TextInputProps,
	TextareaInput:     TextareaInputProps,
	PhoneNumberInput:  PhoneNumberInputProps,
	RichTextInput:     RichTextInputProps,
	Paragraph:         ParagraphProps,
	Image:             ImageProps,
	Link:              LinkProps,
	H1:                HeadingProps,
	H2:                HeadingProps,
	H3:                HeadingProps,
	H4:                HeadingProps,
	H5:                HeadingProps,
	H6:                HeadingProps,
	Code:              CodeProps,
	TogglerInput:      TogglerInputProps,
	SingleSelectInput: SingleSelectInputProps,
	RadioInput:        RadioInputProps,
}

var inputElements = []ElementNameType{
	Input, TextareaInput, PhoneNumberInput, RichTextInput, TogglerInput, SingleSelectInput, RadioInput,
}

func (elName ElementNameType) IsFormElement() bool {
	for _, item := range inputElements {
		if item == elName {
			return true
		}
	}

	return false
}

func (elName ElementNameType) GetSupportedProps() Props {
	val, ok := ElementPropsMap[elName]
	if !ok {
		return Props{}
	}
	return val
}

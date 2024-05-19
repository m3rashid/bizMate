package forms

type supportedFormType string

const (
	_FORM_STRING       supportedFormType = "string"
	_FORM_TEXTAREA     supportedFormType = "textArea"
	_FORM_NUMBER       supportedFormType = "number"
	_FORM_BOOLEAN      supportedFormType = "boolean"
	_FORM_STRING_ARRAY supportedFormType = "Array<string>"
	// _FORM_CHILDREN     supportedFormType = "children"
)

var buttonProps = map[string]supportedFormType{
	"label":     _FORM_STRING,
	"className": _FORM_STRING,
	"type":      _FORM_STRING,
	"size":      _FORM_STRING,
	"variant":   _FORM_STRING,
}

var phoneNumberInputProps = map[string]supportedFormType{
	"name":            _FORM_STRING,
	"label":           _FORM_STRING,
	"required":        _FORM_BOOLEAN,
	"labelClassName":  _FORM_STRING,
	"descriptionText": _FORM_STRING,
}

var textInputProps = map[string]supportedFormType{
	"name":            _FORM_STRING,
	"label":           _FORM_STRING,
	"required":        _FORM_BOOLEAN,
	"labelClassName":  _FORM_STRING,
	"descriptionText": _FORM_STRING,
}

var textareaInputProps = map[string]supportedFormType{
	"name":            _FORM_STRING,
	"label":           _FORM_STRING,
	"required":        _FORM_BOOLEAN,
	"labelClassName":  _FORM_STRING,
	"descriptionText": _FORM_STRING,
}

var paragraphProps = map[string]supportedFormType{
	"text":      _FORM_STRING,
	"className": _FORM_STRING,
}

var columnProps = map[string]supportedFormType{
	"className": _FORM_STRING,
}

var imageProps = map[string]supportedFormType{
	"src":       _FORM_STRING,
	"className": _FORM_STRING,
}

var linkProps = map[string]supportedFormType{
	"href":      _FORM_STRING,
	"text":      _FORM_STRING,
	"className": _FORM_STRING,
	"target":    _FORM_STRING,
}

var headingProps = map[string]supportedFormType{
	"text":      _FORM_STRING,
	"className": _FORM_STRING,
}

var codeProps = map[string]supportedFormType{
	"code":      _FORM_STRING,
	"className": _FORM_STRING,
}

var togglerProps = map[string]supportedFormType{
	"name":            _FORM_STRING,
	"label":           _FORM_STRING,
	"required":        _FORM_BOOLEAN,
	"className":       _FORM_STRING,
	"descriptionText": _FORM_STRING,
}

type elementNameType string

const (
	textInput        elementNameType = "textInput"
	textareaInput    elementNameType = "textareaInput"
	phoneNumberInput elementNameType = "phoneNumberInput"
	toggler          elementNameType = "toggler"
	button           elementNameType = "button"
	paragraph        elementNameType = "paragraph"
	column           elementNameType = "column"
	image            elementNameType = "image"
	link             elementNameType = "link"
	h1               elementNameType = "h1"
	h2               elementNameType = "h2"
	h3               elementNameType = "h3"
	h4               elementNameType = "h4"
	h5               elementNameType = "h5"
	h6               elementNameType = "h6"
	code             elementNameType = "code"
)

var elementPropsMap = map[elementNameType]map[string]supportedFormType{
	textInput:        textInputProps,
	textareaInput:    textareaInputProps,
	phoneNumberInput: phoneNumberInputProps,
	toggler:          togglerProps,

	button:    buttonProps,
	paragraph: paragraphProps,
	column:    columnProps,
	image:     imageProps,
	link:      linkProps,
	h1:        headingProps,
	h2:        headingProps,
	h3:        headingProps,
	h4:        headingProps,
	h5:        headingProps,
	h6:        headingProps,
	code:      codeProps,
}

func isFormElement(elName elementNameType) bool {
	if elName == textInput || elName == textareaInput || elName == phoneNumberInput || elName == toggler {
		return true
	}
	return false
}

func getSupportedProps(elName elementNameType) map[string]supportedFormType {
	val, ok := elementPropsMap[elName]
	if !ok {
		return map[string]supportedFormType{}
	}
	return val
}

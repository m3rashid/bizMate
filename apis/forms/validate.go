package forms

import (
	"bizmate/utils"
	"encoding/json"
	"errors"
	"fmt"
	"reflect"
)

type formElementInstanceType struct {
	ID       string                    `json:"id"`
	Name     elementNameType           `json:"name"`
	Props    map[string]interface{}    `json:"props"`
	Children []formElementInstanceType `json:"children"`
}

func validateFormElementInstance(el formElementInstanceType) []string {
	errorArr := []string{}
	elementProps := el.Props
	supportedProps := getSupportedProps(el.Name)

	if _, ok := el.Props["name"]; isFormElement(el.Name) && !ok {
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

		if (propValueType == _FORM_STRING || propValueType == _FORM_TEXTAREA) && reflect.TypeOf(elementProps[propName]) != reflect.TypeOf("") {
			errorArr = append(errorArr, "invalid data type for "+propName)
		} else if propValueType == _FORM_NUMBER && reflect.TypeOf(elementProps[propName]) != reflect.TypeOf(1) {
			errorArr = append(errorArr, "invalid data type for "+propName)
		} else if propValueType == _FORM_BOOLEAN && reflect.TypeOf(elementProps[propName]) != reflect.TypeOf(true) {
			errorArr = append(errorArr, "invalid data type for "+propName)
			// } else if propValueType == _FORM_CHILDREN {
			// this will be formElement instance
		} else if propValueType == _FORM_STRING_ARRAY && reflect.TypeOf(elementProps[propName]) != reflect.TypeOf([]string{}) {
			errorArr = append(errorArr, "invalid data type for "+propName)
		}
	}

	return errorArr
}

func ValidateFormJsonString(jsonStr string) error {
	jsonArr := []formElementInstanceType{}
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

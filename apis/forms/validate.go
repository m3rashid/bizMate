package forms

import (
	"bizmate/models"
	"bizmate/utils"
	"encoding/json"
	"errors"
	"fmt"
	"reflect"
)

func validateFormElementInstance(el models.FormElementInstanceType) []string {
	errorArr := []string{}
	elementProps := el.Props
	supportedProps := el.Name.GetSupportedProps()

	if _, ok := el.Props["name"]; el.Name.IsFormElement() && !ok {
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

		if (propValueType == models.FORM_STRING || propValueType == models.FORM_TEXTAREA) && reflect.TypeOf(elementProps[propName]) != reflect.TypeOf("") {
			errorArr = append(errorArr, "invalid data type for "+propName)
		} else if propValueType == models.FORM_NUMBER && reflect.TypeOf(elementProps[propName]) != reflect.TypeOf(1) {
			errorArr = append(errorArr, "invalid data type for "+propName)
		} else if propValueType == models.FORM_BOOLEAN && reflect.TypeOf(elementProps[propName]) != reflect.TypeOf(true) {
			errorArr = append(errorArr, "invalid data type for "+propName)
			// } else if propValueType == _FORM_CHILDREN {
			// this will be formElement instance
		} else if propValueType == models.FORM_STRING_ARRAY && reflect.TypeOf(elementProps[propName]) != reflect.TypeOf([]string{}) {
			errorArr = append(errorArr, "invalid data type for "+propName)
		}
	}

	return errorArr
}

func ValidateFormJsonString(jsonStr string) error {
	jsonArr := []models.FormElementInstanceType{}
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

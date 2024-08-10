package forms

import (
	"bizMate/repository"
)

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

func analyzeForm(form *repository.Form, responses *[]repository.FormResponse) ([]Analysis, error) {
	// fields := []Analysis{}
	// formBody := []repository.FormElementType{}
	// if err := json.Unmarshal([]byte((*form).FormBody), &formBody); err != nil {
	// 	return fields, err
	// }

	// 	for _, formElement := range formBody {
	// 		if formElement.Name == models.TogglerInput || formElement.Name == models.SingleSelectInput || formElement.Name == models.RadioInput {
	// 			booleanFieldName, ok := formElement.Props["name"]
	// 			if !ok {
	// 				continue
	// 			}

	// 			booleanFieldLabel, ok := formElement.Props["label"]
	// 			if !ok {
	// 				continue
	// 			}

	// 			if formElement.Name == models.TogglerInput {
	// 				fields = append(fields, Analysis{
	// 					Field:  Field{Name: booleanFieldName.(string), Label: booleanFieldLabel.(string), Type: booleanField},
	// 					Counts: map[string]int{"True": 0, "False": 0},
	// 				})
	// 			} else if formElement.Name == models.RadioInput || formElement.Name == models.SingleSelectInput {
	// 				fieldCountMap := map[string]int{}
	// 				for _, o := range formElement.Props["options"].([]interface{}) {
	// 					if o == nil {
	// 						continue
	// 					}
	// 					if _, ok := o.(string); !ok {
	// 						continue
	// 					}
	// 					fieldCountMap[o.(string)] = 0
	// 				}
	// 				fields = append(fields, Analysis{
	// 					Counts: fieldCountMap,
	// 					Field:  Field{Name: booleanFieldName.(string), Label: booleanFieldLabel.(string), Type: singleSelectField},
	// 				})
	// 			}
	// 		}
	// 	}

	// 	formResponses := []map[string]interface{}{}
	// 	for _, rsp := range *responses {
	// 		temp := map[string]interface{}{}
	// 		if err := json.Unmarshal([]byte(rsp.Response), &temp); err != nil {
	// 			return []Analysis{}, err
	// 		}
	// 		formResponses = append(formResponses, temp)
	// 	}

	analysisResults := []Analysis{}
	// 	for _, field := range fields {
	// 		tmp := map[string]int{}
	// 		for _, resp := range formResponses {
	// 			if field.Type == booleanField {
	// 				if resp[field.Name] == true {
	// 					tmp["True"]++
	// 				} else {
	// 					tmp["False"]++
	// 				}
	// 			} else if field.Type == singleSelectField {
	// 				if resp[field.Name] == nil {
	// 					continue
	// 				}
	// 				if _, ok := tmp[resp[field.Name].(string)]; !ok {
	// 					tmp[resp[field.Name].(string)] = 1
	// 				} else {
	// 					tmp[resp[field.Name].(string)]++
	// 				}
	// 			}
	// 		}
	// 		analysisResults = append(analysisResults, Analysis{Field: field.Field, Counts: tmp})
	// 	}

	return analysisResults, nil
}

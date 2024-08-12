package forms

import (
	"bizMate/repository"
)

func analyzeForm(form *repository.Form, responses *[]repository.FormResponse) ([]Analysis, error) {
	fields := []Analysis{}

	for _, formElement := range form.FormBody {
		if formElement.Name == repository.TogglerInput || formElement.Name == repository.SingleSelectInput || formElement.Name == repository.RadioInput {
			booleanFieldName, ok := formElement.Props["name"]
			if !ok {
				continue
			}

			booleanFieldLabel, ok := formElement.Props["label"]
			if !ok {
				continue
			}

			if formElement.Name == repository.TogglerInput {
				fields = append(fields, Analysis{
					Field:  Field{Name: booleanFieldName.(string), Label: booleanFieldLabel.(string), Type: booleanField},
					Counts: map[string]int{"True": 0, "False": 0},
				})
			} else if formElement.Name == repository.RadioInput || formElement.Name == repository.SingleSelectInput {
				fieldCountMap := map[string]int{}
				for _, o := range formElement.Props["options"].([]interface{}) {
					if o == nil {
						continue
					}
					if _, ok := o.(string); !ok {
						continue
					}
					fieldCountMap[o.(string)] = 0
				}
				fields = append(fields, Analysis{
					Counts: fieldCountMap,
					Field:  Field{Name: booleanFieldName.(string), Label: booleanFieldLabel.(string), Type: singleSelectField},
				})
			}
		}
	}

	analysisResults := []Analysis{}
	for _, field := range fields {
		tmp := map[string]int{}
		for _, resp := range *responses {
			if field.Type == booleanField {
				if resp.Response[field.Name] == true {
					tmp["True"]++
				} else {
					tmp["False"]++
				}
			} else if field.Type == singleSelectField {
				if resp.Response[field.Name] == nil {
					continue
				}
				if _, ok := tmp[resp.Response[field.Name].(string)]; !ok {
					tmp[resp.Response[field.Name].(string)] = 1
				} else {
					tmp[resp.Response[field.Name].(string)]++
				}
			}
		}
		analysisResults = append(analysisResults, Analysis{Field: field.Field, Counts: tmp})
	}

	return analysisResults, nil
}

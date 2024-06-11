package export

import (
	"bizmate/models"
)

func handleFormResponsesExport(formResponses []models.FormResponse, exportFormat ExportFormat, fields []string) {

}

// func interfaceToMap(data []any) ([]map[string]interface{}, error) {
// 	resultsMap := []map[string]interface{}{}

// 	jsonStr, err := json.Marshal(data)
// 	if err != nil {
// 		return resultsMap, err
// 	}

// 	if err = json.Unmarshal([]byte(jsonStr), &resultsMap); err != nil {
// 		return resultsMap, err
// 	}

// 	return resultsMap, nil
// }

package export

import (
	"bizmate/utils"
	"encoding/csv"
	"fmt"
	"os"
	"reflect"
)

func gstCsvFileName(tableName string, tenantName string) string {
	return fmt.Sprintf("%s-%s-records.csv", tenantName, tableName)
}

func handleCsvExport(data []map[string]interface{}, fields []string, fileName string) (string, error) {
	file, err := os.CreateTemp("", fileName)
	if err != nil {
		return "", err
	}
	defer file.Close()

	writer := csv.NewWriter(file)
	defer writer.Flush()

	if err := writer.Write(fields); err != nil {
		return "", err
	}

	for _, record := range data {
		data := []string{}
		for _, field := range fields {
			fieldData, ok := record[field]
			if !ok {
				data = append(data, "")
			} else {
				if reflect.TypeOf(fieldData) == reflect.TypeOf("") {
					data = append(data, fieldData.(string))
				} else if reflect.TypeOf(fieldData) == reflect.TypeOf(true) {
					data = append(data, utils.Ternary(fieldData.(bool), "true", "false"))
				}
			}
		}

		if err := writer.Write(data); err != nil {
			return "", err
		}
	}

	return file.Name(), nil
}

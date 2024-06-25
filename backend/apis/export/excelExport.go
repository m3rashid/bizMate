package export

import (
	"bytes"
	"fmt"

	"github.com/gofiber/fiber/v2"
	"github.com/xuri/excelize/v2"
)

func getExcelFileName(tableName string, ctx *fiber.Ctx) string {
	return getFileName(tableName, ctx) + ".xlsx"
}

var cells = []string{"A", "B", "C", "D", "E", "F", "G", "H", "I", "J", "K", "L", "M", "N", "O", "P", "Q", "R", "S", "T", "U", "V", "W", "X", "Y", "Z"}

func getCell(n int) string {
	if n < 26 {
		return cells[n]
	}

	folds := n % 26
	return getCell(n/26-1) + cells[folds]
}

func handleExcelExport(reqBody exportTableReqBodyType, allData []map[string]interface{}, ctx *fiber.Ctx) error {
	excelFileName := getExcelFileName(reqBody.TableName, ctx)
	if excelFileName == "" {
		ctx.SendStatus(fiber.StatusInternalServerError)
	}

	f := excelize.NewFile()
	defer func() {
		if err := f.Close(); err != nil {
			fmt.Println(err)
		}
	}()

	const sheet1 = "Sheet1"
	index, err := f.NewSheet(sheet1)
	if err != nil {
		fmt.Println(err)
		return err
	}
	f.SetActiveSheet(index)

	for i, field := range reqBody.Fields {
		f.SetCellValue(sheet1, fmt.Sprintf("%s%d", getCell(i), 1), field)
	}

	for i, record := range allData {
		for j, field := range reqBody.Fields {
			fieldData, ok := record[field]
			if !ok {
				fieldData = "-"
			}
			f.SetCellValue(sheet1, fmt.Sprintf("%s%d", getCell(j), i+2), fieldData)
		}
	}

	var buf bytes.Buffer
	if err := f.Write(&buf); err != nil {
		return err
	}

	if _, err := buf.WriteTo(ctx); err != nil {
		return err
	}

	ctx.Set("Content-Type", "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet")
	ctx.Set("Content-Disposition", fmt.Sprintf("attachment; filename=%s", excelFileName))
	ctx.Set("File-Name", excelFileName)
	ctx.Set("Content-Length", fmt.Sprintf("%d", len(buf.Bytes())))

	return nil
}

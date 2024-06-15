package forms

import "testing"

var formValidityTests = map[string]error{
	"[{\"id\":\"img\",\"name\":\"image\",\"props\":{\"src\":\"https://via.placeholder.com/150\",\"alt\":\"placeholder image\",\"className\":\"w-full h-48 object-cover rounded-md\"}}]":                                                                                                                                                                                         nil,
	"[{\"id\":\"img\",\"name\":\"image\",\"props\":{\"src\":\"https://via.placeholder.com/150\",\"alt\":\"placeholder image\",\"className\":\"w-full h-48 object-cover rounded-md\"}},{\"name\":\"input\",\"props\":{\"name\":\"name\",\"label\":\"Name\",\"required\":true,\"labelClassName\":\"\",\"descriptionText\":\"\"},\"label\":\"Text Input\",\"id\":\"6vczvpbqjr\"}]": nil,
}

func TestValidateJsonString(t *testing.T) {
	for input, expected := range formValidityTests {
		res := ValidateFormJsonString(input)
		if res != expected {
			t.Errorf("Expected %v, got %v", expected, res)
		}
	}
}

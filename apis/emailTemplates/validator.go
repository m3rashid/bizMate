package emailtemplates

import (
	"regexp"
)

type HTML struct {
	HtmlString string
	Variables  []string
}

type HtmlTemplate string

func (t *HTML) removeCommentsAndCompress() {
	removeCommentsRegex := regexp.MustCompile(`(?s)<!--.*?-->`)
	noComments := removeCommentsRegex.ReplaceAllString(string(t.HtmlString), "")

	compressRegex := regexp.MustCompile(`\s+`)
	compressed := compressRegex.ReplaceAllString(noComments, " ")
	t.HtmlString = compressed
}

func (t *HTML) getVariables() {
	variablesRegex := regexp.MustCompile(`{{\s*([a-zA-Z0-9_]+)\s*}}`)
	matches := variablesRegex.FindAllStringSubmatch(t.HtmlString, -1)
	variables := make([]string, 0, len(matches))
	for _, match := range matches {
		variables = append(variables, match[1])
	}
	t.Variables = variables
}

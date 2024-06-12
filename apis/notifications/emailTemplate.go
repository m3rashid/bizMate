package notifications

import "regexp"

type emailTemplateReqBody struct {
	Description            string `json:"description"`
	Title                  string `json:"title" validate:"required"`
	SubjectTemplate        string `json:"subjectTemplate" validate:"required"`
	BodyTemplateHtml       string `json:"bodyTemplateHtml" validate:"required"`
	BodyTemplateDesignJson string `json:"bodyTemplateDesignJson" validate:"required"`
}

type HTML struct {
	HtmlString    string
	SubjectString string
}

func (t *HTML) removeCommentsAndCompress() {
	removeCommentsRegex := regexp.MustCompile(`(?s)<!--.*?-->`)
	noComments := removeCommentsRegex.ReplaceAllString(t.HtmlString, "")

	compressRegex := regexp.MustCompile(`\s+`)
	compressed := compressRegex.ReplaceAllString(noComments, " ")
	t.HtmlString = compressed
}

func (t *HTML) getVariables() []string {
	variablesRegex := regexp.MustCompile(`{{\s*([a-zA-Z0-9_]+)\s*}}`)
	bodyMatches := variablesRegex.FindAllStringSubmatch(t.HtmlString, -1)
	variables := make([]string, 0, len(bodyMatches))
	for _, match := range bodyMatches {
		variables = append(variables, match[1])
	}

	subjectMatches := variablesRegex.FindAllStringSubmatch(t.SubjectString, -1)
	for _, match := range subjectMatches {
		variables = append(variables, match[1])
	}

	return variables
}

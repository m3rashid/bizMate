package forms

import (
	"bizMate/async"
	"time"

	"github.com/google/uuid"
)

var localFormAnalyticsCache *async.LocalCache[string, FormAnalysisResponse] = async.NewLocalCache[string, FormAnalysisResponse]("formAnalytics", 100, 1*time.Hour, nil)

func addFormAnalyticsToCache(formId uuid.UUID, formAnalytics FormAnalysisResponse) {
	localFormAnalyticsCache.Set(formId.String(), formAnalytics)
}

func getFormAnalyticsFromCache(formId uuid.UUID) (FormAnalysisResponse, bool) {
	return localFormAnalyticsCache.Get(formId.String())
}

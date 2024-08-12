package forms

import (
	"bizMate/cache"

	"github.com/google/uuid"
)

var LocalFormAnalyticsCache *cache.LocalCacheType[string, FormAnalysisResponse] = cache.New[string, FormAnalysisResponse]("formAnalytics", 100)

func InitLocalFormAnalyticsCache() {
	LocalFormAnalyticsCache.Activate(func() bool {
		return true
	})
}

func addFormAnalyticsToCache(formId uuid.UUID, formAnalytics FormAnalysisResponse) {
	LocalFormAnalyticsCache.Add(formId.String(), formAnalytics)
}

func getFormAnalyticsFromCache(formId uuid.UUID) (FormAnalysisResponse, bool) {
	return LocalFormAnalyticsCache.Get(formId.String())
}

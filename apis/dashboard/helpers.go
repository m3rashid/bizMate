package dashboard

import (
	"bizMate/async"
	"time"
)

type FormResponse struct {
	Active   int64 `json:"active"`
	Inactive int64 `json:"inactive"`
}

type DashboardResponse struct {
	Form  FormResponse `json:"form"`
	Users int64        `json:"users"`
}

var localDashboardCache *async.LocalCache[string, DashboardResponse] = async.NewLocalCache[string, DashboardResponse](
	"workspaceDashboard",
	100,
	30*time.Minute,
	nil,
)

func addDashboardToLocalCache(workspaceID string, response DashboardResponse) {
	localDashboardCache.Set(workspaceID, response)
}

func getDashboardFromLocalCache(workspaceID string) (DashboardResponse, bool) {
	return localDashboardCache.Get(workspaceID)
}

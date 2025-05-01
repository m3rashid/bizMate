package auth

import (
	"bizMate/async"
	"bizMate/repository"
	"time"

	"github.com/google/uuid"
)

var localWorkspacesCache *async.LocalCache[string, repository.Workspace] = async.NewLocalCache[string, repository.Workspace](
	"workspaces",
	100,
	30*time.Minute,
	nil,
)

func addWorkSpaceToCache(workspace repository.Workspace) {
	localWorkspacesCache.Set(workspace.ID.String(), workspace)
}

func getWorkSpaceFromCache(workspaceID uuid.UUID) (repository.Workspace, bool) {
	return localWorkspacesCache.Get(workspaceID.String())
}

var localUsersCache *async.LocalCache[string, repository.User] = async.NewLocalCache[string, repository.User](
	"users",
	1000,
	30*time.Minute,
	nil,
)

func addUserToCache(user repository.User) {
	localUsersCache.Set(user.ID.String(), user)
}

func getUserFromCache(userID uuid.UUID) (repository.User, bool) {
	return localUsersCache.Get(userID.String())
}

package auth

import (
	"bizMate/cache"
	"bizMate/repository"

	"github.com/google/uuid"
)

var LocalWorkspacesCache *cache.LocalCacheType[string, repository.Workspace] = cache.New[string, repository.Workspace](100)

func InitLocalWorkspacesCache() {
	LocalWorkspacesCache.Activate(func() bool {
		return true
	})
}

func addWorkSpaceToCache(workspace repository.Workspace) {
	LocalWorkspacesCache.Add(workspace.ID.String(), workspace)
}

func getWorkSpaceFromCache(workspaceID uuid.UUID) (repository.Workspace, bool) {
	return LocalWorkspacesCache.Get(workspaceID.String())
}

var LocalUsersCache *cache.LocalCacheType[string, repository.User] = cache.New[string, repository.User](1000)

func InitLocalUsersCache() {
	LocalUsersCache.Activate(func() bool {
		return true
	})
}

func addUserToCache(user repository.User) {
	LocalUsersCache.Add(user.ID.String(), user)
}

func getUserFromCache(userID uuid.UUID) (repository.User, bool) {
	return LocalUsersCache.Get(userID.String())
}

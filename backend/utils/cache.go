package utils

import (
	"os"

	"github.com/go-redis/redis/v8"
)

var redisClient *redis.Client

func GetRedisClient() *redis.Client {
	redisUrl := os.Getenv("REDIS_URL")
	if redisClient == nil {
		newRedisClient := redis.NewClient(&redis.Options{Addr: redisUrl})
		redisClient = newRedisClient
	}

	return redisClient
}

var LocalWorkspacesCache *LocalCache[string, string] = newCache[string, string](100)

func InitLocalWorkspacesCache() {
	LocalWorkspacesCache.activate(func() bool {
		return true
	})
}

package cache

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

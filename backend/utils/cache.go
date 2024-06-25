package utils

import (
	"fmt"
	"os"

	"github.com/go-redis/redis/v8"
)

var redisClient *redis.Client

func GetRedisClient() *redis.Client {
	if redisClient == nil {
		fmt.Println("Creating new redis client")
		newRedisClient := redis.NewClient(&redis.Options{
			Addr: os.Getenv("REDIS_URL"),
		})

		redisClient = newRedisClient
	}

	return redisClient
}

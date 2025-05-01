package async

import (
	"bizMate/utils"

	"github.com/go-redis/redis/v8"
)

var redisClient *redis.Client

func GetRedisClient() *redis.Client {
	if redisClient == nil {
		redisClient = redis.NewClient(&redis.Options{
			Addr: utils.Env.RedisUrl,
		})
	}

	return redisClient
}

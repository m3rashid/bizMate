package utils

import (
	"bizMate/cache"
	"context"
	"fmt"
	"time"

	"github.com/google/uuid"
	"go.mongodb.org/mongo-driver/bson/primitive"
)

type LogLevelType int

const (
	LogLevelInfo LogLevelType = iota
	LogLevelWarning
	LogLevelError
)

type LogDataType map[string]interface{}
type LogType struct {
	ID          primitive.ObjectID `json:"_id" bson:"_id"`
	Time        time.Time          `json:"time" bson:"time"`
	LogLevel    LogLevelType       `json:"level" bson:"level"`
	WorkspaceID string             `json:"wId" bson:"wId"`
	UserID      string             `json:"uId" bson:"uId"`
	Code        string             `json:"code" bson:"code"`
	Data        LogDataType        `json:"data" bson:"data"`
}

const LOG_COLLECTION_NAME = "logs"
const max_logs_cache_size = 20

var LogLocalCache *cache.LocalCacheType[string, LogType] = cache.New[string, LogType]("logs", max_logs_cache_size)

func createLog(level LogLevelType, userId uuid.UUID, workspaceId uuid.UUID, code string, data ...LogDataType) LogType {
	log := LogType{
		Code:     code,
		LogLevel: level,
		Time:     time.Now(),
		ID:       primitive.NewObjectID(),
	}
	if len(data) > 0 {
		log.Data = data[0]
	}

	if userId != uuid.Nil {
		log.UserID = userId.String()
	}

	if workspaceId != uuid.Nil {
		log.WorkspaceID = workspaceId.String()
	}

	return log
}

func LogInfo(userId uuid.UUID, workspaceId uuid.UUID, code string, data ...LogDataType) {
	log := createLog(LogLevelInfo, userId, workspaceId, code, data...)
	LogLocalCache.Add(log.ID.String(), log)
}

func LogWarning(userId uuid.UUID, workspaceId uuid.UUID, code string, data ...LogDataType) {
	log := createLog(LogLevelWarning, userId, workspaceId, code, data...)
	LogLocalCache.Add(log.ID.String(), log)
}

func LogError(userId uuid.UUID, workspaceId uuid.UUID, code string, data ...LogDataType) {
	log := createLog(LogLevelError, userId, workspaceId, code, data...)
	LogLocalCache.Add(log.ID.String(), log)
}

func InitLogLocalCache() {
	LogLocalCache.Activate(func() bool {
		_, err := GetMongoDB()
		return err == nil
	})

	LogLocalCache.WithCustomEvictionStrategy(
		func(oldestKey string, items *map[string]*LogType, order *[]string) {
			mongoConn, err := GetMongoDB()
			if err != nil {
				fmt.Println("Error while connecting to mongo", err)
				*LogLocalCache.Active = false
				return
			}

			logs := []interface{}{}
			for _, log := range *items {
				logs = append(logs, *log)
			}

			if _, err := mongoConn.Collection(LOG_COLLECTION_NAME).InsertMany(context.Background(), logs); err != nil {
				fmt.Println("Error while inserting logs to mongo", err)
				return
			}
			go LogLocalCache.Reset()
		},
	)
}

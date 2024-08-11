package utils

import (
	"bizMate/cache"
	"context"
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

var LogLocalCache *cache.LocalCacheType[string, LogType] = cache.New[string, LogType](500)

func createLog(level LogLevelType, userId uuid.UUID, workspaceId uuid.UUID, code string, data LogDataType) LogType {
	return LogType{
		Data:        data,
		Code:        code,
		LogLevel:    level,
		Time:        time.Now(),
		ID:          primitive.NewObjectID(),
		UserID:      Ternary(userId == uuid.Nil, "", userId.String()),
		WorkspaceID: Ternary(workspaceId == uuid.Nil, "", workspaceId.String()),
	}
}

func LogInfo(userId uuid.UUID, workspaceId uuid.UUID, code string, data ...LogDataType) {
	log := createLog(LogLevelInfo, userId, workspaceId, code, data[0])
	LogLocalCache.Add(log.ID.Hex(), log)
}

func LogWarning(userId uuid.UUID, workspaceId uuid.UUID, code string, data ...LogDataType) {
	log := createLog(LogLevelWarning, userId, workspaceId, code, data[0])
	LogLocalCache.Add(log.ID.Hex(), log)
}

func LogError(userId uuid.UUID, workspaceId uuid.UUID, code string, data ...LogDataType) {
	log := createLog(LogLevelError, userId, workspaceId, code, data[0])
	LogLocalCache.Add(log.ID.Hex(), log)
}

func InitLogLocalCache() {
	LogLocalCache.WithCustomEvictionStrategy(
		func(oldestKey string, items *map[string]*LogType, order *[]string) {
			mongoConn, err := GetMongoDB()
			if err != nil {
				*LogLocalCache.Active = false
				return
			}

			logs := make([]interface{}, 0, len(*items))
			for _, log := range *items {
				logs = append(logs, *log)
			}

			res, err := mongoConn.Collection(LOG_COLLECTION_NAME).InsertMany(context.Background(), logs)
			if err != nil {
				return
			}

			if res.InsertedIDs != nil {
				for _, id := range res.InsertedIDs {
					delete(*items, id.(string))
				}
			}

			// clear the cache after processing
			*items = make(map[string]*LogType)
			*order = make([]string, 0, 500)
		},
	)
}

package utils

import (
	"bizMate/repository"
	"context"
	"fmt"
	"time"

	"github.com/google/uuid"
	"go.mongodb.org/mongo-driver/bson/primitive"
)

type LogLevel int

const (
	LogLevelInfo LogLevel = iota
	LogLevelWarning
	LogLevelError
)

type LogData map[string]interface{}
type Log struct {
	ID          primitive.ObjectID `json:"_id" bson:"_id"`
	Time        time.Time          `json:"time" bson:"time"`
	UserID      string             `json:"userId" bson:"uId"`
	LogLevel    LogLevel           `json:"logLevel" bson:"level"`
	WorkspaceID string             `json:"workspaceId" bson:"wId"`
	ObjectType  string             `json:"objectType" bson:"oType"`

	Code string  `json:"code" bson:"code"`
	Data LogData `json:"data" bson:"data"`
}

const LOG_COLLECTION_NAME = "logs"

type logPubSub struct {
	logs chan Log
}

var logsPs *logPubSub

func InitLogsLocalPubSub() {
	max_logs_cache_size := Ternary(*Env.IsProduction, 50, 10)

	if _, err := GetMongoDB(); err != nil {
		fmt.Println("Failed to initialize log-pubsub, mongo connection error", err)
		return
	}

	logsPs = &logPubSub{
		logs: make(chan Log, max_logs_cache_size),
	}

	go func() {
		for {
			time.Sleep(1 * time.Second)
			if len(logsPs.logs) >= max_logs_cache_size/2 {
				insertLogsToDatabase()
			}
		}
	}()
}

func insertLogsToDatabase() {
	logs := []interface{}{}
	for len(logsPs.logs) > 0 {
		logs = append(logs, <-logsPs.logs)
	}

	if len(logs) == 0 {
		return
	}

	mongoConn, err := GetMongoDB()
	if err != nil {
		fmt.Println("Failed to insert logs to database", err)
		return
	}

	if _, err := mongoConn.Collection(LOG_COLLECTION_NAME).InsertMany(context.Background(), logs); err != nil {
		fmt.Println("Error while inserting logs to mongo", err)
		return
	}
}

func createLog(
	level LogLevel,
	userId uuid.UUID,
	workspaceId uuid.UUID,
	objectType repository.ObjectType,
	code string,
	data ...LogData,
) Log {
	log := Log{
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

func LogInfo(
	code string,
	userId uuid.UUID,
	workspaceId uuid.UUID,
	objectType repository.ObjectType,
	data ...LogData,
) {
	log := createLog(LogLevelInfo, userId, workspaceId, objectType, code, data...)
	logsPs.logs <- log
}

func LogWarning(
	code string,
	userId uuid.UUID,
	workspaceId uuid.UUID,
	objectType repository.ObjectType,
	data ...LogData,
) {
	log := createLog(LogLevelWarning, userId, workspaceId, objectType, code, data...)
	logsPs.logs <- log
}

func LogError(
	code string,
	userId uuid.UUID,
	workspaceId uuid.UUID,
	objectType repository.ObjectType,
	data ...LogData,
) {
	log := createLog(LogLevelError, userId, workspaceId, objectType, code, data...)
	logsPs.logs <- log
}

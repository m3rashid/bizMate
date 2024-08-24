package utils

import (
	"bizMate/repository"
	"context"
	"fmt"
	"time"

	"github.com/google/uuid"
	"go.mongodb.org/mongo-driver/bson/primitive"
)

type logPubSub struct {
	logs chan repository.Log
}

var logsPs *logPubSub

func InitLogsLocalPubSub() {
	max_logs_cache_size := Ternary(*Env.IsProduction, 20, 1)

	if _, err := GetMongoDB(); err != nil {
		fmt.Println("Failed to initialize log-pubsub, mongo connection error", err)
		return
	}

	logsPs = &logPubSub{
		logs: make(chan repository.Log, max_logs_cache_size),
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
		return
	}

	repository.InsertLogs(context.Background(), mongoConn, logs)
}

func createLog(
	level repository.LogLevel,
	userEmail string,
	workspaceId uuid.UUID,
	objectType repository.ObjectType,
	code string,
	data ...repository.LogData,
) repository.Log {
	log := repository.Log{
		Code:       code,
		LogLevel:   level,
		Time:       time.Now(),
		ObjectType: string(objectType),
		ID:         primitive.NewObjectID(),
	}

	if len(data) > 0 {
		log.Data = data[0]
	}

	if userEmail != "" {
		log.UserEmail = userEmail
	}

	if workspaceId != uuid.Nil && workspaceId.String() != "" {
		log.WorkspaceID = workspaceId.String()
	}

	return log
}

func LogInfo(
	code string,
	userEmail string,
	workspaceId uuid.UUID,
	objectType repository.ObjectType,
	data ...repository.LogData,
) {
	log := createLog(repository.LogLevelInfo, userEmail, workspaceId, objectType, code, data...)
	logsPs.logs <- log
}

func LogWarning(
	code string,
	userEmail string,
	workspaceId uuid.UUID,
	objectType repository.ObjectType,
	data ...repository.LogData,
) {
	log := createLog(repository.LogLevelWarning, userEmail, workspaceId, objectType, code, data...)
	logsPs.logs <- log
}

func LogError(
	code string,
	userEmail string,
	workspaceId uuid.UUID,
	objectType repository.ObjectType,
	data ...repository.LogData,
) {
	log := createLog(repository.LogLevelError, userEmail, workspaceId, objectType, code, data...)
	logsPs.logs <- log
}

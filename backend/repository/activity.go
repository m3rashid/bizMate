package repository

import (
	"context"
	"time"

	"github.com/google/uuid"
	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/bson/primitive"
	"go.mongodb.org/mongo-driver/mongo"
	"go.mongodb.org/mongo-driver/mongo/options"
)

type LogLevel int

const (
	LogLevelInfo LogLevel = iota
	LogLevelWarning
	LogLevelError
)

type LogData map[string]interface{}
type Log struct {
	ID          primitive.ObjectID `json:"id" bson:"_id"`
	Time        time.Time          `json:"time" bson:"time"`
	UserEmail   string             `json:"userEmail" bson:"uEmail"`
	LogLevel    LogLevel           `json:"logLevel" bson:"level"`
	WorkspaceID string             `json:"workspaceId" bson:"wId"`
	ObjectType  string             `json:"objectType" bson:"oType"`
	Code        string             `json:"code" bson:"code"`
	Data        LogData            `json:"data" bson:"data"`
}

func InsertLogs(ctx context.Context, db *mongo.Database, logs []interface{}) error {
	if _, err := db.Collection(LOG_COLLECTION_NAME).InsertMany(ctx, logs); err != nil {
		return err
	}
	return nil
}

type PaginateWorkspaceActivityParams struct {
	Limit       int64
	Offset      int64
	WorkspaceID uuid.UUID
}

func PaginateWorkspaceActivity(
	ctx context.Context,
	db *mongo.Database,
	params PaginateWorkspaceActivityParams,
) ([]Log, error) {
	cursor, err := db.Collection(LOG_COLLECTION_NAME).Find(
		ctx,
		bson.D{{Key: "wId", Value: params.WorkspaceID.String()}},
		&options.FindOptions{
			Limit: &params.Limit,
			Skip:  &params.Offset,
			Sort:  &bson.D{{Key: "time", Value: -1}},
		},
	)
	if err != nil {
		return nil, err
	}

	logs := []Log{}
	for cursor.Next(ctx) {
		var res Log
		if err := cursor.Decode(&res); err != nil {
			return nil, err
		}
		logs = append(logs, res)
	}

	return logs, nil
}

func GetWorkspaceActivityCount(ctx context.Context, db *mongo.Database, workspaceID uuid.UUID) (int64, error) {
	count, err := db.Collection(LOG_COLLECTION_NAME).CountDocuments(ctx, bson.D{{Key: "wId", Value: workspaceID.String()}})
	if err != nil {
		return 0, err
	}
	return count, nil
}

type PaginateSingleUserActivityParams struct {
	Limit       int64
	Offset      int64
	WorkspaceID uuid.UUID
	UserEmail   string
}

func PaginateSingleUserActivity(
	ctx context.Context,
	db *mongo.Database,
	params PaginateSingleUserActivityParams,
) ([]Log, error) {
	cursor, err := db.Collection(LOG_COLLECTION_NAME).Find(
		ctx,
		bson.D{
			{Key: "wId", Value: params.WorkspaceID.String()},
			{Key: "uEmail", Value: params.UserEmail},
		},
		&options.FindOptions{
			Limit: &params.Limit,
			Skip:  &params.Offset,
			Sort:  &bson.D{{Key: "time", Value: -1}},
		},
	)
	if err != nil {
		return nil, err
	}

	logs := []Log{}
	for cursor.Next(ctx) {
		var res Log
		if err := cursor.Decode(&res); err != nil {
			return nil, err
		}
		logs = append(logs, res)
	}

	return logs, nil
}

func GetSingleUserActivityCount(ctx context.Context, db *mongo.Database, workspaceID uuid.UUID, userEmail string) (int64, error) {
	count, err := db.Collection(LOG_COLLECTION_NAME).CountDocuments(
		ctx,
		bson.D{
			{Key: "wId", Value: workspaceID.String()},
			{Key: "uEmail", Value: userEmail},
		},
	)
	if err != nil {
		return 0, err
	}
	return count, nil
}

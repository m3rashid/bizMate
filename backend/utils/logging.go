package utils

import (
	"context"

	"go.mongodb.org/mongo-driver/bson/primitive"
)

type Log struct {
	ID             primitive.ObjectID `json:"_id" bson:"_id"`
	Event          int                `json:"event" bson:"event"` // 1: Write, 2: Update, 4: Delete
	Message        string             `json:"message" bson:"message"`
	CollectionName string             `json:"collectionName" bson:"collectionName"`
}

const LOG_COLLECTION_NAME = "logs"

var LogLocalCache *LocalCache[string, Log] = newCache[string, Log](500)

func NewLogEvent(event int, message string, collectionName string) {
	logId := primitive.NewObjectID()
	newLog := Log{
		Event:          event,
		Message:        message,
		ID:             logId,
		CollectionName: collectionName,
	}
	LogLocalCache.Set(logId.Hex(), newLog)
}

func InitLogLocalCache() {
	LogLocalCache.withCustomEvictionStrategy(
		func(oldestKey string, oldestItemValue Log, items *map[string]*Log, order *[]string) {
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
			*items = make(map[string]*Log)
			*order = make([]string, 0, 500)
		},
	)
}

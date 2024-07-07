package utils

import (
	"context"
	"fmt"
	"os"

	"go.mongodb.org/mongo-driver/mongo"
	"go.mongodb.org/mongo-driver/mongo/options"
)

var mongoDb *mongo.Database

func GetMongoDB() (*mongo.Database, error) {
	if mongoDb == nil {
		_db, err := getMongoDbConnection()
		if err != nil {
			return nil, err
		}
		mongoDb = _db
	}

	return mongoDb, nil
}

func getMongoDbConnection() (*mongo.Database, error) {
	mongoHost := os.Getenv("MONGO_HOST")
	mongoUser := os.Getenv("MONGO_INITDB_ROOT_USERNAME")
	mongoPass := os.Getenv("MONGO_INITDB_ROOT_PASSWORD")
	mongoDb := os.Getenv("MONGO_INITDB_DATABASE")
	mongoPort := os.Getenv("MONGO_PORT")

	connectionStr := fmt.Sprintf("mongodb://%s:%s@%s:%s/%s", mongoUser, mongoPass, mongoHost, mongoPort, mongoDb)
	loggerOptions := options.Logger().SetComponentLevel(options.LogComponentCommand, options.LogLevelDebug)
	clientOptions := options.Client().ApplyURI(connectionStr).SetLoggerOptions(loggerOptions)

	client, err := mongo.Connect(context.TODO(), clientOptions)
	if err != nil {
		return nil, err
	}

	return client.Database(mongoDb), nil
}

func PingMongoDb() error {
	db, err := GetMongoDB()
	if err != nil {
		return err
	}

	err = db.Client().Ping(context.Background(), nil)
	if err != nil {
		return err
	}

	return nil
}

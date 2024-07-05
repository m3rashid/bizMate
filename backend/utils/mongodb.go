package utils

import (
	"context"
	"fmt"
	"os"

	"go.mongodb.org/mongo-driver/mongo"
	"go.mongodb.org/mongo-driver/mongo/options"
)

var mongoDb *mongo.Client

func GetMongoDB() (*mongo.Client, error) {
	if mongoDb == nil {
		_db, err := getMongoDbConnection()
		if err != nil {
			return nil, err
		}
		mongoDb = _db
	}

	return mongoDb, nil
}

func getMongoDbConnection() (*mongo.Client, error) {
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

	return client, nil
}

func PingMongoDb() error {
	client, err := GetMongoDB()
	if err != nil {
		return err
	}

	err = client.Ping(context.Background(), nil)
	if err != nil {
		return err
	}

	return nil
}

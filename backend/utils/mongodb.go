package utils

import (
	"context"
	"crypto/tls"
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
	connectionStr := os.Getenv("MONGO_URI")
	dbName := os.Getenv("MONGO_DATBASE_NAME")

	loggerOptions := options.Logger().SetComponentLevel(options.LogComponentCommand, options.LogLevelDebug)
	clientOptions := options.Client().ApplyURI(connectionStr).SetLoggerOptions(loggerOptions)
	if os.Getenv("SERVER_MODE") == "production" {
		clientOptions.SetTLSConfig(&tls.Config{InsecureSkipVerify: true}) // Skip certificate verification, not recommended for production
	}

	client, err := mongo.Connect(context.TODO(), clientOptions)
	if err != nil {
		return nil, err
	}

	return client.Database(dbName), nil
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

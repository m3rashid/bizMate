package utils

import (
	"context"
	"os"

	"github.com/jackc/pgx/v5/pgxpool"
	_ "github.com/lib/pq"
)

var postgresDbPool *pgxpool.Pool

func GetPostgresDB() (*pgxpool.Pool, error) {
	if postgresDbPool == nil {
		_db, err := getPostgresDbConnection()
		if err != nil {
			return nil, err
		}
		postgresDbPool = _db
	}

	return postgresDbPool, nil
}

func getPostgresDbConnection() (*pgxpool.Pool, error) {
	connectionStr := os.Getenv("POSTGRES_URI")
	pool, err := pgxpool.New(context.Background(), connectionStr)
	if err != nil {
		return nil, err
	}
	return pool, nil
}

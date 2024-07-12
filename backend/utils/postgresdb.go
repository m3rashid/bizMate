package utils

import (
	"context"
	"fmt"
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
	pgHost := os.Getenv("POSTGRES_HOST")
	pgUser := os.Getenv("POSTGRES_USER")
	pgPass := os.Getenv("POSTGRES_PASSWORD")
	pgDb := os.Getenv("POSTGRES_DB")
	pgPort := os.Getenv("POSTGRES_PORT")

	connectionStr := fmt.Sprintf("postgres://%s:%s@%s:%s/%s?sslmode=disable", pgUser, pgPass, pgHost, pgPort, pgDb)
	pool, err := pgxpool.New(context.Background(), connectionStr)
	if err != nil {
		return nil, err
	}
	return pool, nil
}

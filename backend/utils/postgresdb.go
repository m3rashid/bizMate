package utils

import (
	"context"
	"fmt"
	"os"

	"github.com/jackc/pgx/v5"
	_ "github.com/lib/pq"
)

var postgresDb *pgx.Conn

func GetPostgresDB() (*pgx.Conn, error) {
	if postgresDb == nil {
		_db, err := getPostgresDbConnection()
		if err != nil {
			return nil, err
		}
		postgresDb = _db
	}

	return postgresDb, nil
}

func getPostgresDbConnection() (*pgx.Conn, error) {
	pgHost := os.Getenv("POSTGRES_HOST")
	pgUser := os.Getenv("POSTGRES_USER")
	pgPass := os.Getenv("POSTGRES_PASSWORD")
	pgDb := os.Getenv("POSTGRES_DB")
	pgPort := os.Getenv("POSTGRES_PORT")

	connectionStr := fmt.Sprintf("postgres://%s:%s@%s:%s/%s?sslmode=disable", pgUser, pgPass, pgHost, pgPort, pgDb)
	conn, err := pgx.Connect(context.Background(), connectionStr)
	if err != nil {
		return nil, err
	}
	return conn, nil
}

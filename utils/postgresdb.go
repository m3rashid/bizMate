package utils

import (
	"context"

	"github.com/jackc/pgx/v5/pgxpool"
	_ "github.com/lib/pq"
)

var postgresDbPool *pgxpool.Pool

const NoRowsInResultSet = "no rows in result set"

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
	pool, err := pgxpool.New(context.Background(), Env.PostgresUrl)
	if err != nil {
		return nil, err
	}
	return pool, nil
}

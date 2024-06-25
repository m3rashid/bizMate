package utils

import (
	"fmt"
	"log"
	"os"
	"time"

	"github.com/Pacific73/gorm-cache/cache"
	"github.com/Pacific73/gorm-cache/config"
	"gorm.io/driver/postgres"
	"gorm.io/gorm"
	"gorm.io/gorm/logger"
)

var db *gorm.DB

func GetDB() (*gorm.DB, error) {
	if db == nil {
		_db, err := getDbConnection()
		if err != nil {
			return nil, err
		}
		db = _db
	}

	return db, nil
}

func getDbConnection() (*gorm.DB, error) {
	dsn := fmt.Sprintf("host=%s user=%s password=%s dbname=%s port=%s sslmode=disable TimeZone=Asia/Kolkata",
		os.Getenv("POSTGRES_HOST"),
		os.Getenv("POSTGRES_USER"),
		os.Getenv("POSTGRES_PASSWORD"),
		os.Getenv("POSTGRES_DB"),
		os.Getenv("POSTGRES_PORT"),
	)

	gormDB, err := gorm.Open(postgres.Open(dsn), &gorm.Config{
		Logger: Ternary(os.Getenv("SERVER_MODE") == "development", logger.New(
			log.New(os.Stdout, "\r\n", log.LstdFlags), // io writer
			logger.Config{
				SlowThreshold:        time.Second, // Slow SQL threshold
				LogLevel:             logger.Warn,
				ParameterizedQueries: true,  // Don't include params in the SQL log
				Colorful:             false, // Disable color
			}), nil),
	})
	if err != nil {
		return nil, err
	}

	sqlDB, err := gormDB.DB()
	if err != nil {
		return nil, err
	}

	sqlDB.SetMaxIdleConns(10)
	sqlDB.SetMaxOpenConns(100)
	sqlDB.SetConnMaxLifetime(time.Hour)

	newRedisClient := GetRedisClient()
	cache, err := cache.NewGorm2Cache(&config.CacheConfig{
		CacheLevel:           config.CacheLevelAll,
		CacheStorage:         config.CacheStorageRedis,
		RedisConfig:          cache.NewRedisConfigWithClient(newRedisClient),
		InvalidateWhenUpdate: true,   // when you create/update/delete objects, invalidate cache
		CacheTTL:             100000, // 100s
		CacheMaxItemCnt:      20,     // if length of objects retrieved one single time exceeds this number, then don't cache
	})

	if err != nil {
		fmt.Println("Error creating caching layer: ", err)
		return nil, err
	}

	err = gormDB.Use(cache)
	if err != nil {
		fmt.Println("Error using caching layer: ", err)
		return nil, err
	}

	return gormDB, nil
}

func MigrateModels(models []interface{}) error {
	db, err := GetDB()
	if err != nil {
		log.Fatal(err)
	}
	db.Logger.LogMode(3)
	err = db.AutoMigrate(models...)
	if err != nil {
		log.Fatal(err)
	}
	fmt.Printf("Migrated %d models to database\n", len(models))
	return nil
}

package utils

import (
	"bizmate/models"
	"database/sql"
	"errors"
	"fmt"
	"log"
	"os"
	"regexp"
	"strings"
	"time"

	"github.com/Pacific73/gorm-cache/cache"
	"github.com/Pacific73/gorm-cache/config"
	"github.com/gofiber/fiber/v2"
	"gorm.io/driver/postgres"
	"gorm.io/gorm"
	"gorm.io/gorm/logger"
)

var db *gorm.DB
var TenantModels []interface{}

const CONNECTION_REFRESH_INTERVAL = 1 * time.Hour

type TenantConnection struct {
	Connection *gorm.DB
	CreatedAt  time.Time
}

// map of tenantUrl to tenant db connection
var tenantsDBMap = make(map[string]TenantConnection)

func getDbString(dbName string) string {
	return fmt.Sprintf("postgres://%s:%s@%s:%s/%s?sslmode=disable",
		os.Getenv("POSTGRES_USER"),
		os.Getenv("POSTGRES_PASSWORD"),
		os.Getenv("POSTGRES_HOST"),
		os.Getenv("POSTGRES_PORT"),
		dbName,
	)
}

func GetDbConnection(connectionString string) (*gorm.DB, error) {
	sqlDB, err := sql.Open("pgx", connectionString)
	if err != nil {
		return nil, err
	}

	sqlDB.SetMaxIdleConns(10)
	sqlDB.SetMaxOpenConns(100)
	sqlDB.SetConnMaxLifetime(time.Hour)

	gormDB, err := gorm.Open(postgres.New(postgres.Config{Conn: sqlDB}), &gorm.Config{
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

func GetHostDB() *gorm.DB {
	if db == nil {
		fmt.Println("Creating new host db connection")

		gormDB, err := GetDbConnection(getDbString(os.Getenv("HOST_DB_NAME")))
		if err != nil {
			fmt.Println("Error initializing host db: ", err)
			panic(err)
		}
		db = gormDB
	}

	return db
}

func GetTenantDBFromTenantUrl(tenantUrl string) (*gorm.DB, error) {
	if tenantUrl == "" {
		return nil, errors.New("tenantUrl is empty")
	}

	if tenantsDBMap[tenantUrl].Connection == nil || time.Since(tenantsDBMap[tenantUrl].CreatedAt) > CONNECTION_REFRESH_INTERVAL {
		db := GetHostDB()
		var tenant models.Tenant
		err := db.Where("\"tenantUrl\" = ?", tenantUrl).First(&tenant).Error
		if err != nil {
			fmt.Println("Error fetching tenant: ", err)
			return nil, err
		}

		if tenant.DbUri == "" {
			return nil, fmt.Errorf("DbUri is empty")
		}

		regex := regexp.MustCompile(`^postgres:\/\/(?:[A-Za-z0-9]+):(?:[A-Za-z0-9]+)@[\w\.-]+(?::\d+)?\/[\w\-]+(\?.*)?$`)
		if !regex.MatchString(tenant.DbUri) {
			return nil, fmt.Errorf("invalid DbUri")
		}

		fmt.Println("Creating new tenant db connection for", tenantUrl)
		gormDB, err := GetDbConnection(tenant.DbUri)
		if err != nil {
			fmt.Println("Error initializing tenant db: ", err)
			return nil, err
		}

		// GormMigrate(gormDB, TenantModels)
		tenantsDBMap[tenantUrl] = TenantConnection{
			Connection: gormDB,
			CreatedAt:  time.Now(),
		}
	}

	return tenantsDBMap[tenantUrl].Connection, nil
}

func CreateTenantDatabase(tenantName string, gormDB *gorm.DB) (string, error) {
	regex := regexp.MustCompile("[^a-zA-Z0-9]+")
	dbName := strings.ToLower(regex.ReplaceAllString(tenantName, ""))

	if err := gormDB.Exec("CREATE DATABASE " + dbName).Error; err != nil {
		fmt.Println("Error creating database: ", err)
		return "", err
	}

	dbUri := getDbString(dbName)
	db, err := GetDbConnection(dbUri)
	if err != nil {
		fmt.Println("unable to connect to tenant database")
		// Point of error
		return "", nil
	}

	GormMigrate(db, TenantModels)
	return dbUri, nil
}

func GormMigrate(gormDB *gorm.DB, Models []interface{}) error {
	fmt.Println("Migrating models...")
	err := gormDB.AutoMigrate(Models...)
	if err != nil {
		fmt.Printf("Error migrating models: %v", err)
		return err
	}

	fmt.Println("Migration completed, Migrated " + fmt.Sprint(len(Models)) + " models")
	return nil
}

func GetTenantDbFromCtx(ctx *fiber.Ctx) (*gorm.DB, error) {
	tenantOrigin, err := GetTenantUrlFromCtx(ctx)
	if err != nil {
		return nil, err
	}

	return GetTenantDBFromTenantUrl(tenantOrigin)
}

func GetTenantUrlFromCtx(ctx *fiber.Ctx) (string, error) {
	tenantOrigin := ctx.GetReqHeaders()["Origin"][0]
	tenantOrigin = strings.Replace(tenantOrigin, "http://", "", 1)
	tenantOrigin = strings.Replace(tenantOrigin, "https://", "", 1)
	if tenantOrigin == "" {
		return "", errors.New("no tenant Origin")
	}

	return tenantOrigin, nil
}

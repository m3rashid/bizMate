package controllers

const CREATED_AT_FIELD = "createdAt"
const UPDATED_AT_FIELD = "updatedAt"
const SKIP_VALIDATION_KEY = "skipValidation"

type DbModel interface {
	TableName() string
}

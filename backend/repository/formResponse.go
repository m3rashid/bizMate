package repository

import (
	"context"
	"time"

	"github.com/google/uuid"
	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/bson/primitive"
	"go.mongodb.org/mongo-driver/mongo"
	"go.mongodb.org/mongo-driver/mongo/options"
)

type FormResponse struct {
	ID          primitive.ObjectID     `json:"id" bson:"_id"`
	FormID      string                 `json:"form_id" bson:"form_id"`
	Deleted     *bool                  `json:"deleted" bson:"deleted"`
	WorkspaceID string                 `json:"workspace_id" bson:"workspace_id"`
	CreatedAt   time.Time              `json:"created_at" bson:"created_at"`
	CreatedByID string                 `json:"created_by_id" bson:"created_by_id"`
	DeviceIp    *string                `json:"device_ip" bson:"device_ip"`
	Response    map[string]interface{} `json:"response" bson:"response"`
}

type CreateFormResponseParams struct {
	FormID      uuid.UUID
	WorkspaceID uuid.UUID
	CreatedByID uuid.UUID
	DeviceIp    *string
	Response    map[string]interface{}
}

func CreateFormResponse(
	ctx context.Context,
	db *mongo.Database,
	params CreateFormResponseParams,
) (*mongo.InsertOneResult, error) {
	deleted := false
	res, err := db.Collection(FORM_RESPONSES_COLLECTION_NAME).InsertOne(ctx, FormResponse{
		ID:          primitive.NewObjectID(),
		FormID:      params.FormID.String(),
		Deleted:     &deleted,
		WorkspaceID: params.WorkspaceID.String(),
		CreatedAt:   time.Now(),
		CreatedByID: params.CreatedByID.String(),
		DeviceIp:    params.DeviceIp,
		Response:    params.Response,
	})
	if err != nil {
		return nil, err
	}

	return res, nil
}

func GetFormResponseById(ctx context.Context, db *mongo.Database, formId uuid.UUID) (FormResponse, error) {
	var formResponse FormResponse
	filter := bson.D{{Key: "form_id", Value: formId.String()}}
	err := db.Collection(FORM_RESPONSES_COLLECTION_NAME).FindOne(ctx, filter).Decode(&formResponse)
	if err != nil {
		return FormResponse{}, err
	}

	return formResponse, nil
}

func DeleteFormResponse(ctx context.Context, db *mongo.Database, formResponseId primitive.ObjectID) error {
	deleted := true
	if res := db.Collection(FORM_RESPONSES_COLLECTION_NAME).FindOneAndUpdate(ctx,
		bson.D{{Key: "_id", Value: formResponseId}},
		FormResponse{Deleted: &deleted},
	); res.Err() != nil {
		return res.Err()
	}
	return nil
}

type PaginateFormResponsesParams struct {
	Limit       int64
	Offset      int64
	FormID      uuid.UUID
	WorkspaceID uuid.UUID
}

func PaginateFormResponses(
	ctx context.Context,
	db *mongo.Database,
	params PaginateFormResponsesParams,
) ([]FormResponse, error) {
	cursor, err := db.Collection(FORM_RESPONSES_COLLECTION_NAME).Find(ctx,
		bson.D{
			{Key: "form_id", Value: params.FormID.String()},
			{Key: "workspace_id", Value: params.WorkspaceID.String()},
			{Key: "deleted", Value: false},
		},
		&options.FindOptions{Limit: &params.Limit, Skip: &params.Offset})
	if err != nil {
		return nil, err
	}

	formResponses := []FormResponse{}
	for cursor.Next(ctx) {
		var res FormResponse
		if err := cursor.Decode(&res); err != nil {
			return nil, err
		}
		formResponses = append(formResponses, res)
	}

	return formResponses, nil
}

type GetFormResponsesCountParams struct {
	FormID      uuid.UUID
	WorkspaceID uuid.UUID
}

func GetFormResponsesCount(ctx context.Context, db *mongo.Database, params GetFormResponsesCountParams) (int64, error) {
	count, err := db.Collection(FORM_RESPONSES_COLLECTION_NAME).CountDocuments(ctx, bson.D{
		{Key: "form_id", Value: params.FormID.String()},
		{Key: "workspace_id", Value: params.WorkspaceID.String()},
	})
	if err != nil {
		return 0, err
	}

	return count, nil
}

type GetAllFormResponsesParams struct {
	FormID      uuid.UUID
	WorkspaceID uuid.UUID
}

func GetAllFormResponses(ctx context.Context, db *mongo.Database, params GetAllFormResponsesParams) ([]FormResponse, error) {
	formResponses := []FormResponse{}
	cursor, err := db.Collection(FORM_RESPONSES_COLLECTION_NAME).Find(ctx, bson.D{
		{Key: "form_id", Value: params.FormID.String()},
		{Key: "workspace_id", Value: params.WorkspaceID.String()},
	})
	if err != nil {
		return nil, err
	}

	for cursor.Next(ctx) {
		var formResponse FormResponse
		if err := cursor.Decode(&formResponse); err != nil {
			return nil, err
		}
		formResponses = append(formResponses, formResponse)
	}

	return formResponses, nil
}

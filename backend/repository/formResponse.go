package repository

import (
	"time"

	"github.com/google/uuid"
	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/bson/primitive"
)

type FormResponseBody struct {
	CreatedAt   time.Time              `json:"created_at" bson:"created_at"`
	CreatedByID uuid.UUID              `json:"created_by_id" bson:"created_by_id"`
	DeviceIP    string                 `json:"device_ip" bson:"device_ip"`
	Response    map[string]interface{} `json:"response" bson:"response"`
}

type FormResponseDocument struct {
	ID          primitive.ObjectID `json:"_id" bson:"_id"`
	WorkspaceID uuid.UUID          `json:"workspace_id" bson:"workspace_id"`
	FormID      uuid.UUID          `json:"form_id" bson:"form_id"`
	Responses   []FormResponseBody `json:"responses" bson:"responses"`
}

func (formRes *FormResponseBody) MarshalBSON() ([]byte, error) {
	if formRes.CreatedAt.IsZero() {
		formRes.CreatedAt = time.Now()
	}
	type fr FormResponseBody
	return bson.Marshal((*fr)(formRes))
}

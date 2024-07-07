package repository

import (
	"time"

	"github.com/google/uuid"
	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/bson/primitive"
)

type FormResponse struct {
	ID          primitive.ObjectID     `json:"_id" bson:"_id"`
	CreatedAt   time.Time              `json:"created_at" bson:"created_at"`
	WorkspaceID uuid.UUID              `json:"workspace_id" bson:"workspace_id"`
	CreatedByID uuid.UUID              `json:"created_by_id" bson:"created_by_id"`
	FormID      uuid.UUID              `json:"form_id" bson:"form_id"`
	DeviceIP    string                 `json:"device_ip" bson:"device_ip"`
	Response    map[string]interface{} `json:"response" bson:"response"`
}

type CreateFormResponseParams struct {
	WorkspaceID uuid.UUID
	CreatedByID uuid.UUID
	FormID      uuid.UUID
	DeviceIP    string
	Response    map[string]interface{}
}

func (formRes *FormResponse) MarshalBSON() ([]byte, error) {
	if formRes.CreatedAt.IsZero() {
		formRes.CreatedAt = time.Now()
	}
	type fr FormResponse
	return bson.Marshal((*fr)(formRes))
}

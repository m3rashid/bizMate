package models

const CONFIG_MODEL_NAME string = "configs"

// TODO: think about it
type Config struct {
	BaseModel
	Key   string `gorm:"column:key;not null;unique" json:"key" validate:"required"`
	Value string `gorm:"column:value;not null" json:"value" validate:"required"`
}

/*
configurable items:
- Animations boolean
*/

func (Config) TableName() string {
	return CONFIG_MODEL_NAME
}

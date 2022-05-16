package models

import (
	"gorm-mysql/database"
	"time"
)

type Park_entity struct {
	Id           int       `json:"id";gorm:"primaryKey"`
	Status       int       `json:"status"`
	Gmt_created  time.Time `json:"gmt_created"`
	Gmt_modified time.Time `json:"gmt_modified"`
	Park_name    string    `json:"park_name"`
	Province_id  int       `json:"province_id"`
	City_id      int       `json:"city_id"`
	Region_id    int       `json:"region_id"`
	Address      string    `json:"address"`
}

func (Park_entity) TableName() string {
	return "park_entity"
}
func (park *Park_entity) Get_entity(park_id string) {
	database.DB.Where("id = ?", park_id).First(&park)
}

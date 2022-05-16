package models

import (
	"time"
)

type Road_gate_entity struct {
	Id             int       `json:"id";gorm:"primaryKey"`
	Status         int       `json:"status"`
	Gmt_created    time.Time `json:"gmt_created"`
	Gmt_modified   time.Time `json:"gmt_modified"`
	Park_id        int       `json:"park_id"`
	Road_gate_type int       `json:"road_gate_type"`
	Qr_code        string    `json:"qr_code"`
}

func (Road_gate_entity) TableName() string {
	return "road_gate_entity"
}

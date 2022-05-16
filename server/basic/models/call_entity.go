package models

import (
	"gorm-mysql/database"
	"time"
)

type Call_entity struct {
	Id                   int       `json:"id";gorm:"primaryKey"`
	Status               int       `json:"status"`
	Gmt_created          time.Time `json:"gmt_created"`
	Gmt_modified         time.Time `json:"gmt_modified"`
	Park_id              int       `json:"park_id"`
	Account_id           int       `json:"account_id"`
	Road_gate_id         int       `json:"road_gate_id"`
	Call_status          int       `json:"call_status"`
	Connect_account_type int       `json:"connect_account_type"`
	Call_reason          string    `json:"call_reason"`
	Remark               string    `json:"remark"`
}

func (Call_entity) TableName() string {
	return "call_entity"
}
func (call_entity *Call_entity) Get_call_entity(id int) {
	database.DB.Where("status = 0 and id = ?", id).First(&call_entity)
}

package models

import (
	"time"
)

type Park_account_entity struct {
	Id           int       `json:"id";gorm:"primaryKey"`
	Status       int       `json:"status"`
	Gmt_created  time.Time `json:"gmt_created"`
	Gmt_modified time.Time `json:"gmt_modified"`
	Park_id      int       `json:"park_id"`
	Account_id   int       `json:"account_id"`
}

func (Park_account_entity) TableName() string {
	return "park_account_entity"
}

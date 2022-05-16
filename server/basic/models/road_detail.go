package models

import (
	"gorm-mysql/database"
)

type Road_detail struct {
	Road_id        int `json:"road_id"`
	Road_gate_type int `json:"road_gate_type"`
	Open_id        int `json:"open_id"`
	Open_gate_type int `json:"open_gate_type"`
}

func (road_detail *Road_detail) Get_detail(park_id string, road_id string) {
	database.DB.Raw("select a.id `Road_id`,a.road_gate_type `Road_gate_type`,b.id `Open_id`,b.open_type `Open_gate_type` from road_gate_entity a,open_gate_entity b where b.road_gate_id = a.id and a.park_id = ? and a.id = ?", park_id, road_id).Scan(&road_detail)
}

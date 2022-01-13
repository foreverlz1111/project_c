package models
import(
	"time"
)
type Open_gate_entity struct{
	Id int `json:"id";gorm:"primaryKey"`
	Status int `json:"status"`
	Gmt_created time.Time `json:"gmt_created"`
	Gmt_modified time.Time `json:"gmt_modified"`
	Park_id int `json:"park_id"`
	Open_type int `json:"open_type"`
	Road_gate_id int `json:"road_gate_id"`
}
func (Open_gate_entity)TableName()string{
	return "open_gate_entity"
}

package models
import(
	"time"
)
type Park_entity struct{
	Id int `json:"id";gorm:"primaryKey"`
	Status int `json:"status"`
	Gmt_created time.Time `json:"gmt_created"`
	Gmt_modified time.Time `json:"gmt_modified"`
	Park_name string `json:"park_name"`
	Province_id int `json:"province_id"`
	City_id int `json:"city_id"`
	Region_id int `json:"region_id"`
	Address string `json:"address"`
}
func (Park_entity)TableName()string{
	return "park_entity"
}

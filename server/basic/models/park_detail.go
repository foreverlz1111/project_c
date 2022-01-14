package models
import(
	"time"
	"strconv"
	"log"
	"gorm-mysql/database"
	"strings"
)
type Park_detail struct {
	Id           int       `json:"id"`
	Status       int       `json:"status"`
	Gmt_created  time.Time `json:"gmt_created"`
	Gmt_modified time.Time `json:"gmt_modified"`
	Park_name    string    `json:"park_name"`
	City         string    `json:"city"`
	Address      string    `json:"address"`
}

func (detail *Park_detail) Get_detail(park Park_entity) {
	var province string //巨坑
	var province_id string
	var city string
	var city_id string
	var region string
	var region_id string
	if park.Province_id < 10 {
		province_id = "0" + strconv.Itoa(park.Province_id)
	} else {
		province_id = strconv.Itoa(park.Province_id)
	}
	if park.City_id < 10 {
		city_id = "0" + strconv.Itoa(park.City_id)
	} else {
		city_id = strconv.Itoa(park.City_id)
	}
	if park.Region_id < 10 {
		region_id = "0" + strconv.Itoa(park.Region_id)
	} else {
		region_id = strconv.Itoa(park.Region_id)
	}
	log.Println(province_id, city_id, region_id)
	database.DB.Select("dict_value").Table("dict_entity").Where("dict_name like ?", province_id+"0000").Find(&province)
	if province != "" {
		detail.City += (province + "-")
	}
	database.DB.Select("dict_value").Table("dict_entity").Where("dict_name like ?", province_id+city_id+"00").Find(&city)
	if city != "" {
		detail.City += (city + "-")
	}
	database.DB.Select("dict_value").Table("dict_entity").Where("dict_name like ?", province_id+city_id+region_id).Find(&region)
	if region != "" {
		detail.City += (region)
	}
	detail.City = strings.Replace(detail.City,"\n","",-1)
}

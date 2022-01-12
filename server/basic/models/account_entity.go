package models
import(
	"time"
)
type Account_entity struct{
	Id int `json:"id";gorm:"primaryKey"`
	Status int `json:"status"`
	Gmt_created time.Time `json:"gmt_created"`
	Gmt_modified time.Time `json:"gmt_modified"`
	Account string `json:"account"`
	Password string `json:"password"`
}
func (Account_entity)TableName()string{
	return "account_entity"
}

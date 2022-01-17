package models
import(
	"time"
	"gorm-mysql/database"
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
func (account_entity *Account_entity)Get_account_entity(id int){
	database.DB.Where("status = 0 and id = ?",id).First(&account_entity)
}

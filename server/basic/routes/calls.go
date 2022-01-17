package routes
import(
	"gorm-mysql/database"
	"gorm-mysql/models"
	"github.com/gofiber/fiber/v2"
	"time"
	"strconv"
	"encoding/json"
	"log"
)
func Call(c *fiber.Ctx) error{
	type Parser struct {
		Park_id     json.Number `json:"park_id"`
		Road_gate_id  json.Number `json:"road_gate_id"`
		Remark string `json:"remark"`//备注信息
	}
	park_account := models.Park_account_entity{}
	account_entity := &models.Account_entity{}
	call_entity := models.Call_entity{}
	temp := new(Parser)
	if err := c.BodyParser(temp); err != nil {
		return c.Status(400).JSON(err.Error())
	}
	log.Println(temp)
	v, _ := strconv.ParseInt(string(temp.Park_id), 10, 64)
	database.DB.Where("park_id = ?", int(v)).First(&park_account)
	if park_account.Park_id == 0 {
		return c.Status(400).SendString("车场无客服")
	}
	call_entity.Gmt_created = time.Now()
	call_entity.Gmt_modified = time.Now()
	call_entity.Account_id = park_account.Account_id
	//v, _ := strconv.ParseInt(string(temp.Park_id), 10, 64)
	call_entity.Park_id = int(v)
	v, _ = strconv.ParseInt(string(temp.Road_gate_id), 10, 64)
	call_entity.Road_gate_id = int(v)
	call_entity.Call_status = 1
	call_entity.Connect_account_type = 1
	call_entity.Remark = temp.Remark
	result := database.DB.Create(&call_entity)
	if result.Error != nil{
		return c.Status(400).JSON(result.Error)	
	}
	//result.RowsAffected
	log.Println("park_account.Account_id:",park_account.Account_id)
	account_entity.Get_account_entity(park_account.Account_id)
	account_entity.Password = ""
	log.Println("account_entit",account_entity)
	return c.Status(200).JSON(account_entity)//.SendString("已记录呼叫信息")	
}
func Call_accept(c *fiber.Ctx) error{
	call_entity := models.Call_entity{}
	type Parser struct {
		Account_id json.Number `json:"account_id"`
	}
	temp := new(Parser)
	if err := c.BodyParser(temp); err != nil {
		return c.Status(400).JSON(err.Error())
	}
	v, _ := strconv.ParseInt(string(temp.Account_id), 10, 64)
	database.DB.Where("status = 0 and account_id = ?",int(v)).First(&call_entity)
	call_entity.Gmt_modified = time.Now()
	call_entity.Call_status = 2
	result := database.DB.Save(&call_entity)
	if result.Error != nil{
		return c.Status(400).JSON(result.Error)	
	}
	return c.Status(200).SendString("已更新呼叫信息:接听")
}
func Call_reject(c *fiber.Ctx) error{
	call_entity := models.Call_entity{}
	type Parser struct {
		Account_id json.Number `json:"account_id"`
	}
	temp := new(Parser)
	if err := c.BodyParser(temp); err != nil {
		return c.Status(400).JSON(err.Error())
	}
	v, _ := strconv.ParseInt(string(temp.Account_id), 10, 64)
	database.DB.Where("status = 0 and account_id = ?",int(v)).First(&call_entity)
	call_entity.Gmt_modified = time.Now()
	remark := "客服主动取消"
	call_entity.Remark = call_entity.Remark + remark
	call_entity.Call_status = 4
	result := database.DB.Save(&call_entity)
	if result.Error != nil{
		return c.Status(400).JSON(result.Error)	
	}
	return c.Status(200).SendString("已更新呼叫信息：" + remark)
}

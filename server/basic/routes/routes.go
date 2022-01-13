package routes

import(
	"gorm-mysql/database"
	"gorm-mysql/models"
	"log"
	"github.com/gofiber/fiber/v2"

)

func Hello(ctx *fiber.Ctx) error{
	err := ctx.SendString("服务器准备就绪")
	if err != nil{
		log.Println(err)
		return err
	}
	return nil
}
func Login(c *fiber.Ctx) error{
	acc := c.Params("account")
	pwd := c.Params("password")
	account_entity := new(models.Account_entity)
	database.DB.Where("account = ? and password = ? and status = 0",acc,pwd).Find(&account_entity)
	if account_entity.Account != ""{
		log.Println(account_entity)
		return c.Status(200).JSON(account_entity)
	}
	log.Println(account_entity)
	return c.Status(400).SendString("未找到该用户")
}
func Park_account(c *fiber.Ctx) error{
	id := c.Params("account_id")
	var park_account models.Park_account{}
	database.DB.where("account_id = ?",id).First(&park_account)
	if park_account.Park_id != ""{
		log.Println(park_account)
		return c.Status(200).JSON(park_account)
	}
	log.Println(park_account)
	return c.Status(400).SendString("无车场可管理")
}

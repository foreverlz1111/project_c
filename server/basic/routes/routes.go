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
	database.DB.Where("account = ? and password = ?",acc,pwd).Find(&account_entity)
	if account_entity.Account != ""{
		log.Println(account_entity)
		return c.Status(200).JSON(account_entity)
	}
	log.Println(account_entity)
	return c.Status(400).SendString("未找到该用户")
}

package routes

import (
	"gorm-mysql/database"
	"gorm-mysql/models"
	"log"
	"github.com/gofiber/fiber/v2"
)

//Hello
func Hello(c *fiber.Ctx) error {
	return c.SendString("服务器准备就绪")
}
func Allinfo(c *fiber.Ctx) error {
	info := []models.Info_table{}

	database.DBConn.Find(&info)

	log.Printf("未解析前的info信息：%v,长度%d \n",info,len(info))
	if len(info) > 0{
		log.Println("info[0].Name ",info[0].Id)
	}
	return c.Status(200).JSON(info)

	
}


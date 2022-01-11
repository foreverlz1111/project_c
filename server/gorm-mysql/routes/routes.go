package routes

import (
	"gorm-mysql/database"
	"gorm-mysql/models"
	"log"
	"github.com/gofiber/fiber/v2"
	"time"
	"strconv"
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

func Insertone(c *fiber.Ctx)error{
	info := new(models.Info_table)
	if err := c.BodyParser(info); err != nil {
		return c.Status(400).JSON(err.Error())
	}
	str := c.Params("my_timestamp")
	unix ,_ := strconv.ParseInt(str,10,64)
	info.Whentime = time.Unix(unix, 0)
	result := database.DBConn.Create(&info)
	log.Printf("期望插入内容 %v,影响行数 :%v,错误 %v",info,result.RowsAffected,result.Error)
	return c.Status(200).JSON(info)
}

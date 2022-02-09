package routes

import (
	"encoding/json"
	"github.com/gofiber/fiber/v2"
	"gorm-mysql/database"
	"gorm-mysql/models"
	"log"
	"strconv"
	"time"
)

func Park_status_change(c *fiber.Ctx) error {
	type Parser struct {
		Park_id json.Number `json:"park_id"`
		Status  json.Number `json:"status"`
	}
	park_entity := new(models.Park_entity)
	temp := new(Parser)
	if err := c.BodyParser(temp); err != nil {
		return c.Status(400).JSON(err.Error())
	}
	log.Println(temp)
	v, _ := strconv.ParseInt(string(temp.Park_id), 10, 64)
	park_entity.Id = int(v)
	v, _ = strconv.ParseInt(string(temp.Status), 10, 64)
	if int(v) == 1 {
		park_entity.Status = 0
	} else if int(v) == 0 {
		park_entity.Status = 1
	}
	park_entity.Gmt_modified = time.Now()
	result := database.DB.Model(&park_entity).Select("id", "status", "gmt_modified").Updates(park_entity)
	if result.RowsAffected > 0 {
		return c.Status(200).SendString("更新成功")
	}
	return c.Status(400).SendString("更新失败")
}
func Park_name_change(c *fiber.Ctx) error {
	type Parser struct {
		Park_id   json.Number `json:"park_id"`
		Park_name string      `json:"park_name"`
	}
	temp := new(Parser)
	park_entity := new(models.Park_entity)
	if err := c.BodyParser(temp); err != nil {
		return c.Status(400).JSON(err.Error())
	}
	log.Println(temp)
	v, _ := strconv.ParseInt(string(temp.Park_id), 10, 64)
	park_entity.Id = int(v)
	park_entity.Park_name = temp.Park_name
	park_entity.Gmt_modified = time.Now()
	result := database.DB.Model(&park_entity).Select("id", "Park_name", "Gmt_modified").Updates(park_entity)
	if result.RowsAffected > 0 {
		return c.Status(200).SendString("更新成功")
	}
	return c.Status(400).SendString("更新失败")
}
func Call_entity_update_remark(c *fiber.Ctx) error {
	type Parser struct {
		Id     json.Number `json:"id"`
		Remark string      `json:"remark"`
	}
	call_entity := &models.Call_entity{}
	temp := new(Parser)
	if err := c.BodyParser(temp); err != nil {
		return c.Status(400).JSON(err.Error())
	}
	v, _ := strconv.ParseInt(string(temp.Id), 10, 64)
	call_entity.Get_call_entity(int(v))
	call_entity.Gmt_modified = time.Now()
	call_entity.Remark = temp.Remark
	if result := database.DB.Save(&call_entity); result.Error != nil {
		return c.Status(400).JSON(result.Error)
	}
	return c.Status(200).SendString("更新成功啦!")
}

func Call_entity_deletion(c *fiber.Ctx) error {
	type Parser struct {
		Id json.Number `json:"id"`
	}
	temp := new(Parser)
	call_entity := new(models.Call_entity)
	if err := c.BodyParser(temp); err != nil {
		return c.Status(400).JSON(err.Error())
	}
	v, _ := strconv.ParseInt(string(temp.Id), 10, 64)
	call_entity.Id = int(v)
	call_entity.Gmt_modified = time.Now()
	call_entity.Status = -1
	result := database.DB.Model(&call_entity).Select("id", "status", "Gmt_modified").Updates(call_entity)
	if result.RowsAffected > 0 {
		return c.Status(200).SendString("更新成功")
	}
	return c.Status(400).SendString("更新失败")
}

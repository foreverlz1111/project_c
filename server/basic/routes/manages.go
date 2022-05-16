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
func Add_gate(c *fiber.Ctx) error {
	type Parser struct {
		Id             json.Number `json:"park_id"`
		Road_gate_type json.Number `json:"road_gate_type"`
		Open_type      json.Number `json:"open_type"`
	}
	road_gate_entity := new(models.Road_gate_entity)
	open_gate_entity := new(models.Open_gate_entity)
	temp := new(Parser)
	if err := c.BodyParser(temp); err != nil {
		return c.Status(400).JSON(err.Error())
	}
	road_gate_entity.Status = 0
	road_gate_entity.Gmt_created = time.Now()
	road_gate_entity.Gmt_modified = time.Now()
	v, _ := strconv.ParseInt(string(temp.Id), 10, 64)
	road_gate_entity.Park_id = int(v)
	open_gate_entity.Park_id = int(v)
	v, _ = strconv.ParseInt(string(temp.Road_gate_type), 10, 64)
	road_gate_entity.Road_gate_type = int(v)
	open_gate_entity.Status = 0
	open_gate_entity.Gmt_created = time.Now()
	open_gate_entity.Gmt_modified = time.Now()
	v, _ = strconv.ParseInt(string(temp.Open_type), 10, 64)
	open_gate_entity.Open_type = int(v)
	result := database.DB.Omit("id", "qr_code").Create(&road_gate_entity)
	if result.RowsAffected > 0 {
		log.Println("插入编号 ", road_gate_entity.Id)
		open_gate_entity.Road_gate_id = road_gate_entity.Id
		result = database.DB.Omit("id").Create(&open_gate_entity)
		if result.RowsAffected > 0 {
			return c.Status(200).SendString("添加成功")
		}
	}
	return c.Status(400).SendString("添加失败")
}
func Update_gate_type(c *fiber.Ctx) error {
	type Parser struct {
		Id             json.Number `json:"id"`
		Road_gate_type json.Number `json:"road_gate_type"`
	}
	temp := new(Parser)
	road_gate_entity := new(models.Road_gate_entity)
	if err := c.BodyParser(temp); err != nil {
		return c.Status(400).JSON(err.Error())
	}
	road_gate_entity.Gmt_modified = time.Now()
	v, _ := strconv.ParseInt(string(temp.Road_gate_type), 10, 64)
	road_gate_entity.Road_gate_type = int(v)
	v, _ = strconv.ParseInt(string(temp.Id), 10, 64)
	road_gate_entity.Id = int(v)
	result := database.DB.Model(&road_gate_entity).Select("gmt_modified", "road_gate_type").Updates(road_gate_entity)
	if result.RowsAffected > 0 {
		return c.Status(200).SendString("更新成功")
	}
	return c.Status(400).SendString("更新失败")
}
func Delete_gate(c *fiber.Ctx) error {
	type Parser struct {
		Park_id      json.Number `json:"park_id"`
		Road_gate_id json.Number `json:"road_gate_id"`
	}
	temp := new(Parser)
	road_gate_entity := new(models.Road_gate_entity)
	open_gate_entity := new(models.Open_gate_entity)
	if err := c.BodyParser(temp); err != nil {
		return c.Status(400).SendString("数据异常") //JSON(err.Error())
	}
	v, _ := strconv.ParseInt(string(temp.Road_gate_id), 10, 64)
	road_gate_entity.Id = int(v)
	road_gate_entity.Status = -1
	road_gate_entity.Gmt_modified = time.Now()
	open_gate_entity.Road_gate_id = int(v)
	v, _ = strconv.ParseInt(string(temp.Park_id), 10, 64)
	open_gate_entity.Park_id = int(v)
	open_gate_entity.Gmt_modified = time.Now()
	open_gate_entity.Status = -1
	tx := database.DB.Begin()
	result := tx.Model(&road_gate_entity).Select("id", "gmt_modified", "status").Updates(road_gate_entity)
	if result.RowsAffected > 0 {
		result = tx.Model(&open_gate_entity).Where("park_id = ? and road_gate_id = ?", open_gate_entity.Park_id, open_gate_entity.Road_gate_id).Select("gmt_modified", "status").Updates(open_gate_entity)
		if result.RowsAffected > 0 {
			tx.Commit()
			return c.Status(200).SendString("更新成功")
		}
	}
	tx.Rollback()
	return c.Status(400).SendString("更新失败")
}
func Change_password(c *fiber.Ctx) error {
	type Parser struct {
		Account      string `json:"account"`
		Old_password string `json:"old_password"`
		New_password string `json:"new_password"`
	}
	temp := new(Parser)
	account_entity := new(models.Account_entity)
	if err := c.BodyParser(temp); err != nil {
		return c.Status(400).SendString("数据异常")
	}
	result := database.DB.Where("account = ? and password = ?", temp.Account, temp.Old_password).Find(&account_entity)
	if result.RowsAffected > 0 {
		log.Println(account_entity)
		account_entity.Gmt_modified = time.Now()
		account_entity.Password = temp.New_password
		result = database.DB.Model(&account_entity).Where("account = ?", temp.Account).Select("password", "gmt_modified").Updates(account_entity)
		if result.RowsAffected > 0 {
			return c.Status(200).SendString("修改成功")
		}
		return c.Status(400).SendString("修改失败")
	}
	return c.Status(400).SendString("原密码错误")
}

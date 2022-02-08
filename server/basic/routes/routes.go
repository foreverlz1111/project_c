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

func Hello(ctx *fiber.Ctx) error {
	err := ctx.SendString("服务器准备就绪")
	if err != nil {
		log.Println(err)
		return err
	}
	return nil
}
func Login(c *fiber.Ctx) error {
	acc := c.Params("account")
	pwd := c.Params("password")
	account_entity := new(models.Account_entity)
	database.DB.Where("account = ? and password = ? and status = 0", acc, pwd).First(&account_entity)
	if account_entity.Account != "" {
		log.Println(account_entity)
		return c.Status(200).JSON(account_entity)
	}
	log.Println(account_entity)
	return c.Status(400).SendString("未找到该用户")
}
func Park(c *fiber.Ctx) error {
	id := c.Params("account_id")
	park_account := models.Park_account_entity{}
	park := models.Park_entity{}
	database.DB.Where("account_id = ?", id).First(&park_account)
	if park_account.Park_id != 0 {
		log.Println(park_account)
		database.DB.Where("id = ? and status not in (-1)", park_account.Park_id).First(&park)
		if park.Id != 0 {
			detail := &models.Park_detail{
				Id:           park.Id,
				Status:       park.Status,
				Gmt_created:  park.Gmt_created,
				Gmt_modified: park.Gmt_modified,
				Park_name:    park.Park_name,
				Address:      park.Address,
			}
			detail.Get_detail(park)
			return c.Status(200).JSON(detail)
		}
		return c.Status(400).SendString("车场已停运")
	}
	log.Println(park_account)
	return c.Status(400).SendString("无车场可管理")
}
func Road_gate(c *fiber.Ctx) error {
	park_id := c.Params("park_id")
	road_gate := []models.Road_gate_entity{}
	open_gate := []models.Open_gate_entity{}
	database.DB.Where("park_id = ?", park_id).Find(&road_gate)
	log.Println("road_gate", road_gate)
	if road_gate != nil {
		subsql := database.DB.Select("id").Where("park_id = ? ", park_id).Table("road_gate_entity")
		database.DB.Where("road_gate_id IN (?) ", subsql).Find(&open_gate)
		type Items struct {
			r []models.Road_gate_entity `json:"r"`
			o []models.Open_gate_entity `json:"o"`
		}
		item := new(Items)
		item.r = road_gate
		item.o = open_gate
		out := map[string]interface{}{}
		out["r"] = item.r
		out["o"] = item.o
		return c.Status(200).JSON(out)
	}
	return c.Status(400).SendString("车场无道闸")
}
func Road(c *fiber.Ctx) error {
	park_id := c.Params("park_id")
	detail := []models.Road_detail{}
	database.DB.Raw("select a.id `Road_id`,a.road_gate_type `Road_gate_type`,b.id `Open_id`,b.open_type `Open_gate_type` from road_gate_entity a,open_gate_entity b where b.road_gate_id = a.id and a.park_id = ?", park_id).Scan(&detail)
	if len(detail) > 0 {
		return c.Status(200).JSON(detail)
	}
	return c.Status(400).SendString("车场无道闸")
}
func Open_change(c *fiber.Ctx) error {
	type Parser struct {
		Id     json.Number `json:"id"` //陨石坑
		Status json.Number `json:"status"`
	}
	temp := new(Parser)
	open_gate := new(models.Open_gate_entity)
	if err := c.BodyParser(temp); err != nil {
		return c.Status(400).JSON(err.Error())
	}
	v, _ := strconv.ParseInt(string(temp.Id), 10, 64)
	open_gate.Id = int(v)
	v, _ = strconv.ParseInt(string(temp.Status), 10, 64)
	open_gate.Open_type = int(v)
	if open_gate.Open_type == 1 {
		open_gate.Open_type++
	} else if open_gate.Open_type == 2 {
		open_gate.Open_type--
	}
	open_gate.Gmt_modified = time.Now()
	result := database.DB.Model(&open_gate).Select("open_type", "gmt_modified").Updates(open_gate)
	if result.RowsAffected > 0 {
		return c.Status(200).SendString("更新成功")
	}
	return c.Status(400).SendString("更新失败")
}
func Fetcher(c *fiber.Ctx) error {
	park_id := c.Params("park_id")
	road_id := c.Params("road_id")
	park := models.Park_entity{}
	road := models.Road_detail{}
	park_detail := models.Park_detail{}
	park.Get_entity(park_id)
	park_detail.Get_detail(park)
	road.Get_detail(park_id, road_id)
	log.Println(park_detail, road)
	type Items struct {
		p models.Park_detail `json:"p"`
		r models.Road_detail `json:"r"`
	}
	item := Items{p: park_detail, r: road}
	out := map[string]interface{}{}
	out["p"] = item.p
	out["r"] = item.r
	return c.Status(200).JSON(out)
}
